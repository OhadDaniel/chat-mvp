import { Logger, type MessageEvent } from '@nestjs/common';
import { firstValueFrom, toArray } from 'rxjs';
import type { ClientSession } from 'mongoose';
import type { ConversationsService } from '../conversations/conversations.service';
import type { StoredConversation } from '../conversations/conversations.types';
import type { MessagesService } from '../messages/messages.service';
import type { Message } from '../messages/messages.types';
import type { TransactionRunner } from '../mongo/transaction.runner';
import type { LlmProvider } from '../ai-assistant/llm-abstraction/llm-provider';
import type { ProviderStreamEvent } from '../ai-assistant/llm-abstraction/llm.types';
import type { User } from '../users/users.types';
import { StreamAssistantReplyOrchestrator } from './stream-assistant-reply.orchestrator';

const ohad: User = {
  id: 'user-1',
  email: 'ohad@chat.dev',
  firstName: 'Ohad',
  lastName: 'Daniel',
  passwordHash: 'hash',
  avatar: null,
};

const fakeSession = {} as ClientSession;

const transactionRunner = {
  run: jest.fn((work: (session: ClientSession) => Promise<unknown>) =>
    work(fakeSession),
  ),
} as unknown as TransactionRunner;

function assistantConversation(): StoredConversation {
  return {
    id: 'conv-1',
    type: 'assistant',
    participantIds: ['user-1'],
    lastMessage: null,
    lastMessageAt: null,
    pinnedAt: null,
  };
}

function assistantMessage(): Message {
  return {
    id: 'msg-ai',
    conversationId: 'conv-1',
    sender: { id: 'assistant', name: 'Maxwell', avatarInitials: 'M', avatarUrl: null },
    content: 'Hello',
    sentAt: new Date().toISOString(),
    status: 'sent',
  };
}

async function* scriptedStream(
  events: ProviderStreamEvent[],
): AsyncGenerator<ProviderStreamEvent> {
  for (const event of events) {
    yield event;
  }
}

function collect(
  orchestrator: StreamAssistantReplyOrchestrator,
): Promise<MessageEvent[]> {
  return firstValueFrom(orchestrator.execute('conv-1', ohad).pipe(toArray()));
}

describe('StreamAssistantReplyOrchestrator', () => {
  it('streams the reply, persists it, and signals done', async () => {
    const llmProvider = {
      streamMessage: jest.fn(() =>
        scriptedStream([
          { type: 'text_delta', text: 'Hel' },
          { type: 'text_delta', text: 'lo' },
          { type: 'message_stop', stopReason: 'stop' },
        ]),
      ),
    } as unknown as LlmProvider;
    const createAssistantMessage = jest.fn(() =>
      Promise.resolve(assistantMessage()),
    );
    const messages = {
      loadRecent: jest.fn(() => Promise.resolve([])),
      createAssistantMessage,
    } as unknown as MessagesService;
    const conversations = {
      getForParticipant: jest.fn(() => Promise.resolve(assistantConversation())),
      updateLastMessage: jest.fn(() => Promise.resolve()),
    } as unknown as ConversationsService;

    const orchestrator = new StreamAssistantReplyOrchestrator(
      conversations,
      messages,
      transactionRunner,
      llmProvider,
    );

    const events = await collect(orchestrator);

    expect(events).toEqual([
      { type: 'delta', data: { text: 'Hel' } },
      { type: 'delta', data: { text: 'lo' } },
      { type: 'done', data: { messageId: 'msg-ai' } },
    ]);
    expect(createAssistantMessage).toHaveBeenCalledWith(
      'conv-1',
      'Hello',
      fakeSession,
    );
  });

  it('emits a not-found error for a non-assistant conversation and never streams', async () => {
    const createAssistantMessage = jest.fn();
    const conversations = {
      getForParticipant: jest.fn(() =>
        Promise.resolve({ ...assistantConversation(), type: 'direct' }),
      ),
    } as unknown as ConversationsService;
    const messages = {
      loadRecent: jest.fn(),
      createAssistantMessage,
    } as unknown as MessagesService;
    const llmProvider = { streamMessage: jest.fn() } as unknown as LlmProvider;

    const orchestrator = new StreamAssistantReplyOrchestrator(
      conversations,
      messages,
      transactionRunner,
      llmProvider,
    );

    const events = await collect(orchestrator);

    expect(events).toEqual([
      { type: 'error', data: { code: 'CONVERSATION_NOT_FOUND' } },
    ]);
    expect(llmProvider.streamMessage).not.toHaveBeenCalled();
    expect(createAssistantMessage).not.toHaveBeenCalled();
  });

  it('emits an error event and does not persist when the model call fails', async () => {
    const errorLog = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
    async function* boom(): AsyncGenerator<ProviderStreamEvent> {
      yield { type: 'text_delta', text: 'partial' };
      throw new Error('provider exploded');
    }
    const createAssistantMessage = jest.fn();
    const messages = {
      loadRecent: jest.fn(() => Promise.resolve([])),
      createAssistantMessage,
    } as unknown as MessagesService;
    const conversations = {
      getForParticipant: jest.fn(() => Promise.resolve(assistantConversation())),
      updateLastMessage: jest.fn(() => Promise.resolve()),
    } as unknown as ConversationsService;
    const llmProvider = {
      streamMessage: jest.fn(() => boom()),
    } as unknown as LlmProvider;

    const orchestrator = new StreamAssistantReplyOrchestrator(
      conversations,
      messages,
      transactionRunner,
      llmProvider,
    );

    const events = await collect(orchestrator);

    expect(events).toEqual([
      { type: 'delta', data: { text: 'partial' } },
      { type: 'error', data: { code: 'ASSISTANT_STREAM_FAILED' } },
    ]);
    expect(createAssistantMessage).not.toHaveBeenCalled();
    errorLog.mockRestore();
  });

  it('runs a requested tool, feeds the result back, then streams the answer', async () => {
    const streamMessage = jest
      .fn()
      .mockReturnValueOnce(
        scriptedStream([
          {
            type: 'tool_use',
            id: 'call_1',
            name: 'summarize_my_recent_messages',
            input: { limit: 3 },
          },
          { type: 'message_stop', stopReason: 'tool_calls' },
        ]),
      )
      .mockReturnValueOnce(
        scriptedStream([
          { type: 'text_delta', text: 'You sent 3 messages.' },
          { type: 'message_stop', stopReason: 'stop' },
        ]),
      );
    const llmProvider = { streamMessage } as unknown as LlmProvider;
    const findRecentBySender = jest.fn(() =>
      Promise.resolve([
        {
          id: 'm1',
          conversationId: 'conv-1',
          senderId: 'user-1',
          content: 'hey',
          sentAt: '2026-01-01T00:00:00.000Z',
        },
      ]),
    );
    const createAssistantMessage = jest.fn(() =>
      Promise.resolve(assistantMessage()),
    );
    const messages = {
      loadRecent: jest.fn(() => Promise.resolve([])),
      createAssistantMessage,
      findRecentBySender,
    } as unknown as MessagesService;
    const conversations = {
      getForParticipant: jest.fn(() => Promise.resolve(assistantConversation())),
      updateLastMessage: jest.fn(() => Promise.resolve()),
    } as unknown as ConversationsService;

    const orchestrator = new StreamAssistantReplyOrchestrator(
      conversations,
      messages,
      transactionRunner,
      llmProvider,
    );

    const events = await collect(orchestrator);

    expect(streamMessage).toHaveBeenCalledTimes(2);
    expect(findRecentBySender).toHaveBeenCalledWith('user-1', 3);
    expect(events).toContainEqual({
      type: 'delta',
      data: { text: 'You sent 3 messages.' },
    });
    expect(events).toContainEqual({ type: 'done', data: { messageId: 'msg-ai' } });
    expect(createAssistantMessage).toHaveBeenCalledWith(
      'conv-1',
      'You sent 3 messages.',
      fakeSession,
    );
  });
});
