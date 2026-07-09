import { firstValueFrom, of, toArray } from 'rxjs';
import type { MessageEvent } from '@nestjs/common';
import { StreamReplyRouterOrchestrator } from './stream-reply-router.orchestrator';
import type { ConversationsService } from '../conversations/conversations.service';
import type { StreamAgentReplyOrchestrator } from '../stream-agent-reply-orchestrator/stream-agent-reply.orchestrator';
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

function conversation(type: StoredConversation['type']): StoredConversation {
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
  let agent: jest.Mocked<Pick<StreamAgentReplyOrchestrator, 'execute'>>;
  let orchestrator: StreamReplyRouterOrchestrator;

  beforeEach(() => {
    conversations = { getForParticipant: jest.fn() };
    agent = {
      execute: jest
        .fn()
        .mockReturnValue(of({ type: 'done', data: { from: 'agent' } })),
    };
    orchestrator = new StreamReplyRouterOrchestrator(
      conversations as unknown as ConversationsService,
      agent as unknown as StreamAgentReplyOrchestrator,
    );
  });

  async function collect(): Promise<MessageEvent[]> {
    return firstValueFrom(orchestrator.execute('conv-1', USER).pipe(toArray()));
  }

  it('routes an assistant conversation to the agent orchestrator', async () => {
    conversations.getForParticipant.mockResolvedValue(conversation('assistant'));

    const events = await collect();

    expect(agent.execute).toHaveBeenCalledWith('conv-1', USER);
    expect(events[0].data).toEqual({ from: 'agent' });
  });

  it('routes a tutor conversation to the agent orchestrator', async () => {
    conversations.getForParticipant.mockResolvedValue(conversation('tutor'));

    const events = await collect();

    expect(agent.execute).toHaveBeenCalledWith('conv-1', USER);
    expect(events[0].data).toEqual({ from: 'agent' });
  });

  it('emits an error for a non-repliable conversation type', async () => {
    conversations.getForParticipant.mockResolvedValue(conversation('direct'));

    const events = await collect();

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('error');
    expect(agent.execute).not.toHaveBeenCalled();
  });
});
