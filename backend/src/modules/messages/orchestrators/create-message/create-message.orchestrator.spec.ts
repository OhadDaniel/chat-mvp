import { AppException } from '../../../../common/errors/app.exception';
import type { ConversationsService } from '../../../conversations/conversations.service';
import type { User } from '../../../users/users.types';
import type { MessagesService } from '../../messages.service';
import { CreateMessageOrchestrator } from './create-message.orchestrator';

const ohad: User = {
  id: 'user-1',
  email: 'ohad@chat.dev',
  name: 'Ohad Daniel',
  avatarInitials: 'OD',
  passwordHash: 'hash',
};

const allowAccess = {
  getForParticipant: jest.fn(() => Promise.resolve({})),
} as unknown as ConversationsService;

const denyAccess = {
  getForParticipant: jest.fn(() =>
    Promise.reject(new AppException(403, 'NOT_A_PARTICIPANT', 'no')),
  ),
} as unknown as ConversationsService;

describe('CreateMessageOrchestrator', () => {
  it('authorizes before inserting — a 403 means the write never runs', async () => {
    const create = jest.fn();
    const orchestrator = new CreateMessageOrchestrator(denyAccess, {
      create,
    } as unknown as MessagesService);

    await expect(
      orchestrator.run('conv-1', ohad, { content: 'let me in' }),
    ).rejects.toMatchObject({ code: 'NOT_A_PARTICIPANT' });

    expect(create).not.toHaveBeenCalled();
  });

  it('delegates to MessagesService.create once authorized', async () => {
    const create = jest.fn(() =>
      Promise.resolve({ message: { id: 'msg-new' } }),
    );
    const orchestrator = new CreateMessageOrchestrator(allowAccess, {
      create,
    } as unknown as MessagesService);

    await orchestrator.run('conv-1', ohad, { content: 'hi' });

    expect(create).toHaveBeenCalledWith('conv-1', ohad, { content: 'hi' });
  });
});
