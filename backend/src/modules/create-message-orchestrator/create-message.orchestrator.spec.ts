import type { ClientSession } from 'mongoose';
import { AppException } from '../../common/errors/app.exception';
import type { ConversationsService } from '../conversations/conversations.service';
import type { TransactionRunner } from '../mongo/transaction.runner';
import type { User } from '../users/users.types';
import type { MessagesService } from '../messages/messages.service';
import type { Message } from '../messages/messages.types';
import { CreateMessageOrchestrator } from './create-message.orchestrator';

const ohad: User = {
  id: 'user-1',
  email: 'ohad@chat.dev',
  firstName: 'Ohad',
  lastName: 'Daniel',
  passwordHash: 'hash',
  avatar: null,
};

const fakeSession = {} as ClientSession;

// Runs the work immediately with a fake session — i.e. a committed transaction.
const transactionRunner = {
  run: jest.fn((work: (session: ClientSession) => Promise<unknown>) =>
    work(fakeSession),
  ),
} as unknown as TransactionRunner;

const denyAccess = {
  assertParticipant: jest.fn(() =>
    Promise.reject(new AppException(403, 'NOT_A_PARTICIPANT', 'no')),
  ),
} as unknown as ConversationsService;

function sentMessage(): Message {
  return {
    id: 'msg-new',
    conversationId: 'conv-1',
    sender: { id: 'user-1', name: 'Ohad Daniel', avatarInitials: 'OD', avatarUrl: null },
    content: 'hi',
    sentAt: new Date().toISOString(),
    status: 'sent',
  };
}

describe('CreateMessageOrchestrator', () => {
  it('authorizes before inserting — a 403 means the write never runs', async () => {
    const create = jest.fn();
    const orchestrator = new CreateMessageOrchestrator(
      denyAccess,
      { create } as unknown as MessagesService,
      transactionRunner,
    );

    await expect(
      orchestrator.execute('conv-1', ohad, { content: 'let me in' }),
    ).rejects.toMatchObject({ code: 'NOT_A_PARTICIPANT' });

    expect(create).not.toHaveBeenCalled();
  });

  it('inserts the message AND refreshes the conversation snapshot, both in one transaction session', async () => {
    const create = jest.fn(() => Promise.resolve(sentMessage()));
    const updateLastMessage = jest.fn(() => Promise.resolve());
    const conversations = {
      assertParticipant: jest.fn(() => Promise.resolve()),
      updateLastMessage,
    } as unknown as ConversationsService;

    const orchestrator = new CreateMessageOrchestrator(
      conversations,
      { create } as unknown as MessagesService,
      transactionRunner,
    );

    await orchestrator.execute('conv-1', ohad, { content: 'hi' });

    // both writes get the SAME session (atomic), and the snapshot is mapped from the message
    expect(create).toHaveBeenCalledWith(
      'conv-1',
      ohad,
      { content: 'hi' },
      fakeSession,
    );
    expect(updateLastMessage).toHaveBeenCalledWith(
      'conv-1',
      { content: 'hi', senderId: 'user-1', sentAt: expect.any(Date) },
      fakeSession,
    );
  });
});
