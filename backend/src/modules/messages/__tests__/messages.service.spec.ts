import type { StorageService } from '../../storage/storage.service';
import type { User } from '../../users/users.types';
import type { MessagesRepository } from '../messages.repository';
import { MessagesService } from '../messages.service';
import type { Message } from '../messages.types';

const ohad: User = {
  id: 'user-1',
  email: 'ohad@chat.dev',
  firstName: 'Ohad',
  lastName: 'Daniel',
  passwordHash: 'hash',
  avatarKey: null,
};

const fakeStorage = {
  publicUrl: jest.fn((key: string | null) => key),
} as unknown as StorageService;

function message(id: string): Message {
  return {
    id,
    conversationId: 'conv-1',
    sender: { id: 'user-1', name: 'O', avatarInitials: 'O', avatarUrl: null },
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

function makeService(overrides: RepoOverrides = {}): MessagesService {
  return new MessagesService(fakeRepository(overrides), fakeStorage);
}

describe('MessagesService.getPage (pagination, single-entity)', () => {
  it('defaults the limit to 30 and silently caps it at 50 (week-3 contract)', async () => {
    const findPageBefore = jest.fn(() =>
      Promise.resolve({ messages: [], hasMore: false }),
    );
    const service = makeService({ findPageBefore });

    await service.getPage('conv-1', {});
    expect(findPageBefore).toHaveBeenLastCalledWith('conv-1', undefined, 30);

    await service.getPage('conv-1', { limit: 999 });
    expect(findPageBefore).toHaveBeenLastCalledWith('conv-1', undefined, 50);
  });

  it('treats an unknown cursor as "no cursor" (newest page, week-3 behavior)', async () => {
    const findPageBefore = jest.fn(() =>
      Promise.resolve({ messages: [message('msg-3')], hasMore: false }),
    );
    const service = makeService({
      findCursorPoint: () => Promise.resolve(undefined), // cursor not found
      findPageBefore,
    });

    await service.getPage('conv-1', { cursor: 'garbage-id' });

    expect(findPageBefore).toHaveBeenCalledWith('conv-1', undefined, 30);
  });

  it('nextCursor = oldest message of the page, only when more history exists', async () => {
    const page = [message('msg-2'), message('msg-3')]; // ascending
    const withMore = makeService({
      findPageBefore: () => Promise.resolve({ messages: page, hasMore: true }),
    });
    const lastPage = makeService({
      findPageBefore: () => Promise.resolve({ messages: page, hasMore: false }),
    });

    await expect(withMore.getPage('conv-1', {})).resolves.toMatchObject({
      nextCursor: 'msg-2',
    });
    await expect(lastPage.getPage('conv-1', {})).resolves.toMatchObject({
      nextCursor: null,
    });
  });
});

describe('MessagesService.create', () => {
  it('passes the sender as a PUBLIC profile — no hash, no email reaches the repository', async () => {
    const insert = jest.fn(() => Promise.resolve(message('msg-new')));
    const service = makeService({ insert });

    await service.create('conv-1', ohad, { content: 'hello' });

    const senderArg = (insert.mock.calls[0] as unknown[])[2];
    expect(senderArg).not.toHaveProperty('passwordHash');
    expect(senderArg).not.toHaveProperty('email');
    expect(senderArg).toMatchObject({ id: 'user-1' });
  });
});
