import { firstValueFrom, of, toArray } from 'rxjs';
import type { MessageEvent } from '@nestjs/common';
import { StreamReplyRouterOrchestrator } from './stream-reply-router.orchestrator';
import type { ConversationsService } from '../conversations/conversations.service';
import type { StreamAssistantReplyOrchestrator } from '../stream-assistant-reply-orchestrator/stream-assistant-reply.orchestrator';
import type { StreamTutorReplyOrchestrator } from '../stream-tutor-reply-orchestrator/stream-tutor-reply.orchestrator';
import type { StoredConversation } from '../conversations/conversations.types';
import type { User } from '../users/users.types';

const USER: User = {
  id: 'user-1',
  email: 'ohad@example.com',
  firstName: 'Ohad',
  lastName: 'Daniel',
  passwordHash: 'hash',
  avatar: null,
};

function conversation(
  type: StoredConversation['type'],
): StoredConversation {
  const base = {
    id: 'conv-1',
    participantIds: ['user-1'],
    lastMessage: null,
    lastMessageAt: null,
    pinnedAt: null,
  };
  if (type === 'tutor') {
    return { ...base, type: 'tutor', name: 'Tutor', avatar: null };
  }
  if (type === 'group') {
    return {
      ...base,
      type: 'group',
      name: 'Group',
      createdBy: 'user-1',
      avatar: null,
    };
  }
  if (type === 'direct') {
    return { ...base, type: 'direct' };
  }
  return { ...base, type: 'assistant' };
}

describe('StreamReplyRouterOrchestrator', () => {
  let conversations: jest.Mocked<Pick<ConversationsService, 'getForParticipant'>>;
  let assistant: jest.Mocked<Pick<StreamAssistantReplyOrchestrator, 'execute'>>;
  let tutor: jest.Mocked<Pick<StreamTutorReplyOrchestrator, 'execute'>>;
  let orchestrator: StreamReplyRouterOrchestrator;

  beforeEach(() => {
    conversations = { getForParticipant: jest.fn() };
    assistant = {
      execute: jest
        .fn()
        .mockReturnValue(of({ type: 'done', data: { from: 'assistant' } })),
    };
    tutor = {
      execute: jest
        .fn()
        .mockReturnValue(of({ type: 'done', data: { from: 'tutor' } })),
    };
    orchestrator = new StreamReplyRouterOrchestrator(
      conversations as unknown as ConversationsService,
      assistant as unknown as StreamAssistantReplyOrchestrator,
      tutor as unknown as StreamTutorReplyOrchestrator,
    );
  });

  async function collect(): Promise<MessageEvent[]> {
    return firstValueFrom(orchestrator.execute('conv-1', USER).pipe(toArray()));
  }

  it('routes an assistant conversation to the Maxwell orchestrator', async () => {
    conversations.getForParticipant.mockResolvedValue(conversation('assistant'));

    const events = await collect();

    expect(assistant.execute).toHaveBeenCalledWith('conv-1', USER);
    expect(tutor.execute).not.toHaveBeenCalled();
    expect(events[0].data).toEqual({ from: 'assistant' });
  });

  it('routes a tutor conversation to the tutor RAG orchestrator', async () => {
    conversations.getForParticipant.mockResolvedValue(conversation('tutor'));

    const events = await collect();

    expect(tutor.execute).toHaveBeenCalledWith('conv-1', USER);
    expect(assistant.execute).not.toHaveBeenCalled();
    expect(events[0].data).toEqual({ from: 'tutor' });
  });

  it('emits an error for a non-repliable conversation type', async () => {
    conversations.getForParticipant.mockResolvedValue(conversation('direct'));

    const events = await collect();

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('error');
    expect(assistant.execute).not.toHaveBeenCalled();
    expect(tutor.execute).not.toHaveBeenCalled();
  });
});
