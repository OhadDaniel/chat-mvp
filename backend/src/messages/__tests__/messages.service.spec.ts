import { AppException } from '../../common/errors/app.exception';
import type { ConversationsService } from '../../conversations/conversations.service';
import type { User } from '../../users/users.types';
import type { MessagesRepository } from '../messages.repository';
import { MessagesService } from '../messages.service';
import type { Message } from '../messages.types';

const ohad: User = {
  id: 'user-1',
  email: 'ohad@chat.dev',
  name: 'Ohad Daniel',
  avatarInitials: 'OD',
  passwordHash: 'hash',
};

function message(id: string): Message {
  return {
    id,
    conversationId: 'conv-1',
    sender: { id: 'user-1', email: 'o@c.d', name: 'O', avatarInitials: 'O' },
    content: `content of ${id}`,
    sentAt: new Date().toISOString(),
    status: 'sent',
  };
}

type RepoOverrides = Partial<Record<keyof MessagesRepository, unknown>>;

function fakeRepository(overrides: RepoOverrides = {}): MessagesRepository {
  return {
    findCursorPoint: jest.fn(() => Promise.resolve(undefined)),
    findPageBefore: jest.fn(() =>
      Promise.resolve({ messages: [], hasMore: false }),
    ),
    insert: jest.fn(() => Promise.resolve(message('msg-new'))),
    insertSeed: jest.fn(() => Promise.resolve()),
    count: jest.fn(() => Promise.resolve(0)),
    ...overrides,
  } as unknown as MessagesRepository;
}

const allowAccess = {
  getForParticipant: jest.fn(() => Promise.resolve({})),
} as unknown as ConversationsService;

const denyAccess = {
  getForParticipant: jest.fn(() =>
    Promise.reject(new AppException(403, 'NOT_A_PARTICIPANT', 'no')),
  ),
} as unknown as ConversationsService;

describe('MessagesService.getPage', () => {
  it('a 403 from the conversation gate means the repository is never touched', async () => {
    const findPageBefore = jest.fn();
    const service = new MessagesService(
      fakeRepository({ findPageBefore }),
      denyAccess,
    );

    await expect(service.getPage('conv-1', 'eve-99', {})).rejects.toMatchObject(
      { code: 'NOT_A_PARTICIPANT' },
    );

    expect(findPageBefore).not.toHaveBeenCalled();
  });

  it('defaults the limit to 30 and silently caps it at 50 (week-3 contract)', async () => {
    const findPageBefore = jest.fn(() =>
      Promise.resolve({ messages: [], hasMore: false }),
    );
    const service = new MessagesService(
      fakeRepository({ findPageBefore }),
      allowAccess,
    );

    await service.getPage('conv-1', 'user-1', {});
    expect(findPageBefore).toHaveBeenLastCalledWith('conv-1', undefined, 30);

    await service.getPage('conv-1', 'user-1', { limit: 999 });
    expect(findPageBefore).toHaveBeenLastCalledWith('conv-1', undefined, 50);
  });

  it('treats an unknown cursor as "no cursor" (newest page, week-3 behavior)', async () => {
    const findPageBefore = jest.fn(() =>
      Promise.resolve({ messages: [message('msg-3')], hasMore: false }),
    );
    const service = new MessagesService(
      fakeRepository({
        findCursorPoint: () => Promise.resolve(undefined), // cursor not found
        findPageBefore,
      }),
      allowAccess,
    );

    await service.getPage('conv-1', 'user-1', { cursor: 'garbage-id' });

    expect(findPageBefore).toHaveBeenCalledWith('conv-1', undefined, 30);
  });

  it('nextCursor = oldest message of the page, only when more history exists', async () => {
    const page = [message('msg-2'), message('msg-3')]; // ascending
    const withMore = new MessagesService(
      fakeRepository({
        findPageBefore: () =>
          Promise.resolve({ messages: page, hasMore: true }),
      }),
      allowAccess,
    );
    const lastPage = new MessagesService(
      fakeRepository({
        findPageBefore: () =>
          Promise.resolve({ messages: page, hasMore: false }),
      }),
      allowAccess,
    );

    await expect(
      withMore.getPage('conv-1', 'user-1', {}),
    ).resolves.toMatchObject({ nextCursor: 'msg-2' });
    await expect(
      lastPage.getPage('conv-1', 'user-1', {}),
    ).resolves.toMatchObject({ nextCursor: null });
  });
});

describe('MessagesService.create', () => {
  it('authorizes before inserting — same gate as reads', async () => {
    const insert = jest.fn();
    const service = new MessagesService(fakeRepository({ insert }), denyAccess);

    await expect(
      service.create('conv-1', ohad, { content: 'let me in' }),
    ).rejects.toMatchObject({ code: 'NOT_A_PARTICIPANT' });

    expect(insert).not.toHaveBeenCalled();
  });

  it('passes the sender as a PUBLIC user — the hash never reaches the repository', async () => {
    const insert = jest.fn(() => Promise.resolve(message('msg-new')));
    const service = new MessagesService(
      fakeRepository({ insert }),
      allowAccess,
    );

    await service.create('conv-1', ohad, { content: 'hello' });

    const senderArg = (insert.mock.calls[0] as unknown[])[2];
    expect(senderArg).not.toHaveProperty('passwordHash');
    expect(senderArg).toMatchObject({ id: 'user-1' });
  });
});
