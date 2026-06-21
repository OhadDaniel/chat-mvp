import { AppException } from '../../common/errors/app.exception';
import type { ConversationsService } from '../conversations/conversations.service';
import type { MessagesService } from '../messages/messages.service';
import type { UsersService } from '../users/users.service';
import { GetMessagesOrchestrator } from './get-messages.orchestrator';

const allowAccess = {
  getForParticipant: jest.fn(() => Promise.resolve({ participantIds: [] })),
} as unknown as ConversationsService;

const denyAccess = {
  getForParticipant: jest.fn(() =>
    Promise.reject(new AppException(403, 'NOT_A_PARTICIPANT', 'no')),
  ),
} as unknown as ConversationsService;

const fakeUsers = {
  findByIds: jest.fn(() => Promise.resolve([])),
} as unknown as UsersService;

describe('GetMessagesOrchestrator', () => {
  it('a 403 from the conversation gate means the messages service is never touched', async () => {
    const getPage = jest.fn();
    const orchestrator = new GetMessagesOrchestrator(
      denyAccess,
      { getPage } as unknown as MessagesService,
      fakeUsers,
    );

    await expect(
      orchestrator.run('conv-1', 'eve-99', {}),
    ).rejects.toMatchObject({ code: 'NOT_A_PARTICIPANT' });

    expect(getPage).not.toHaveBeenCalled();
  });

  it('pages once authorized, passing the joined participants for sender resolution', async () => {
    const getPage = jest.fn(() =>
      Promise.resolve({ messages: [], nextCursor: null }),
    );
    const orchestrator = new GetMessagesOrchestrator(
      allowAccess,
      { getPage } as unknown as MessagesService,
      fakeUsers,
    );

    await orchestrator.run('conv-1', 'user-1', { limit: 10 });

    expect(getPage).toHaveBeenCalledWith('conv-1', { limit: 10 }, []);
  });
});
