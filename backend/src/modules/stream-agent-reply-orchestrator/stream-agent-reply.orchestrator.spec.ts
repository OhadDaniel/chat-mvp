import { firstValueFrom, toArray } from 'rxjs';
import { AIMessage, ToolMessage } from '@langchain/core/messages';
import type { MessageEvent } from '@nestjs/common';
import { StreamAgentReplyOrchestrator } from './stream-agent-reply.orchestrator';
import { RETRIEVE_DOCS_TOOL } from '../agent/agent.constants';
import type { AgentGraph } from '../agent/agent.graph';
import type { ConversationsService } from '../conversations/conversations.service';
import type { MessagesService } from '../messages/messages.service';
import type { TransactionRunner } from '../mongo/transaction.runner';
import type { StoredConversation } from '../conversations/conversations.types';
import type { Message, StoredMessage } from '../messages/messages.types';
import type { User } from '../users/users.types';

const USER: User = {
  id: 'user-1',
  email: 'a@b.com',
  firstName: 'A',
  lastName: 'B',
  passwordHash: 'h',
  avatar: null,
};

const TUTOR: StoredConversation = {
  id: 'conv-1',
  type: 'tutor',
  name: 'Tutor',
  avatar: null,
  participantIds: ['user-1'],
  lastMessage: null,
  lastMessageAt: null,
  pinnedAt: null,
};

const CITATIONS = [{ chunkId: 'k1', documentName: 'doc', text: 'ctx' }];

function questionMessage(): StoredMessage {
  return {
    id: 'm1',
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: 'what is x?',
    sentAt: '2026-01-01T00:00:00.000Z',
  };
}

function reply(): Message {
  return {
    id: 'reply-1',
    conversationId: 'conv-1',
    sender: { id: 'assistant' },
    content: 'Answer',
    sentAt: '2026-01-02T00:00:00.000Z',
    status: 'sent',
  } as unknown as Message;
}

async function* fakeStream(): AsyncGenerator<unknown> {
  yield [
    'updates',
    {
      route: {
        messages: [
          new AIMessage({
            content: '',
            tool_calls: [
              {
                name: RETRIEVE_DOCS_TOOL,
                args: { query: 'x' },
                id: 't1',
                type: 'tool_call',
              },
            ],
          }),
        ],
      },
    },
  ];
  yield [
    'updates',
    {
      retrieve: {
        messages: [
          new ToolMessage({
            content: '[1] ctx',
            tool_call_id: 't1',
            name: RETRIEVE_DOCS_TOOL,
          }),
        ],
        citations: CITATIONS,
      },
    },
  ];
  yield ['custom', { token: 'Answer' }];
}

type Mocks = {
  conversations: ConversationsService;
  messages: MessagesService;
  transactions: TransactionRunner;
  agentGraph: AgentGraph;
  stream: jest.Mock;
  createAssistantMessage: jest.Mock;
};

const DIRECT: StoredConversation = {
  id: 'conv-1',
  type: 'direct',
  participantIds: ['user-1'],
  lastMessage: null,
  lastMessageAt: null,
  pinnedAt: null,
};

function buildMocks(overrides?: {
  conversation?: StoredConversation;
  recent?: StoredMessage[];
}): Mocks {
  const conversation: StoredConversation = overrides?.conversation ?? TUTOR;
  const recent = overrides?.recent ?? [questionMessage()];

  const stream = jest.fn().mockResolvedValue(fakeStream());
  const graphMock = {
    stream,
    getState: jest.fn().mockResolvedValue({ values: { citations: CITATIONS } }),
  };
  const createAssistantMessage = jest.fn().mockResolvedValue(reply());

  return {
    conversations: {
      getForParticipant: jest.fn().mockResolvedValue(conversation),
      updateLastMessage: jest.fn().mockResolvedValue(undefined),
    } as unknown as ConversationsService,
    messages: {
      loadRecent: jest.fn().mockResolvedValue(recent),
      createAssistantMessage,
    } as unknown as MessagesService,
    transactions: {
      run: jest.fn((work: (session: unknown) => unknown) => work({})),
    } as unknown as TransactionRunner,
    agentGraph: {
      getGraph: jest.fn().mockReturnValue(graphMock),
    } as unknown as AgentGraph,
    stream,
    createAssistantMessage,
  };
}

function collect(mocks: Mocks): Promise<MessageEvent[]> {
  const orchestrator = new StreamAgentReplyOrchestrator(
    mocks.conversations,
    mocks.messages,
    mocks.transactions,
    mocks.agentGraph,
  );
  return firstValueFrom(orchestrator.execute('conv-1', USER).pipe(toArray()));
}

describe('StreamAgentReplyOrchestrator', () => {
  it('streams tool progress, token deltas, then a done event, and persists the reply', async () => {
    const mocks = buildMocks();

    const events = await collect(mocks);

    expect(events.map((event) => event.type)).toEqual([
      'tool_call',
      'tool_result',
      'delta',
      'done',
    ]);
    expect(events[0].data).toEqual({ id: 't1', name: RETRIEVE_DOCS_TOOL });
    expect(events[2].data).toEqual({ text: 'Answer' });
    expect(events[3].data).toEqual({
      messageId: 'reply-1',
      citations: CITATIONS,
    });
    expect(mocks.createAssistantMessage).toHaveBeenCalledWith(
      'conv-1',
      'Answer',
      {},
      CITATIONS,
    );
  });

  it('passes thread_id, user and mode through the graph config', async () => {
    const mocks = buildMocks();

    await collect(mocks);

    const options: unknown = mocks.stream.mock.calls[0][1];
    expect(options).toMatchObject({
      configurable: {
        thread_id: 'conv-1',
        userId: 'user-1',
        conversationId: 'conv-1',
        mode: 'tutor',
      },
    });
  });

  it('emits an error for a non-repliable conversation type', async () => {
    const mocks = buildMocks({ conversation: DIRECT });

    const events = await collect(mocks);

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('error');
    expect(mocks.stream).not.toHaveBeenCalled();
  });

  it('emits an error when there is no question to answer', async () => {
    const mocks = buildMocks({ recent: [] });

    const events = await collect(mocks);

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('error');
    expect(events[0].data).toEqual({ code: 'NO_QUESTION' });
  });
});
