import { AppException } from '../../common/errors/app.exception';
import type { UsersService } from '../../users/users.service';
import type { User } from '../../users/users.types';
import type { ConversationsRepository } from '../conversations.repository';
import { ConversationsService } from '../conversations.service';
import type { Conversation } from '../conversations.types';

const ohad: User = {
  id: 'user-1',
  email: 'ohad@chat.dev',
  name: 'Ohad Daniel',
  avatarInitials: 'OD',
  passwordHash: 'hash',
};

function conversationBetween(a: string, b: string): Conversation {
  return {
    id: 'conv-x',
    participants: [
      { id: a, email: `${a}@chat.dev`, name: a, avatarInitials: 'X' },
      { id: b, email: `${b}@chat.dev`, name: b, avatarInitials: 'Y' },
    ],
    lastMessage: null,
    lastMessageAt: null,
    pinnedAt: null,
  };
}

type RepoOverrides = Partial<Record<keyof ConversationsRepository, unknown>>;

function fakeRepository(
  overrides: RepoOverrides = {},
): ConversationsRepository {
  return {
    findAllByUserId: jest.fn(() => Promise.resolve([])),
    findById: jest.fn(() => Promise.resolve(undefined)),
    existsByPair: jest.fn(() => Promise.resolve(false)),
    insert: jest.fn(() => Promise.resolve()),
    setPinned: jest.fn(() => Promise.resolve()),
    count: jest.fn(() => Promise.resolve(0)),
    ...overrides,
  } as unknown as ConversationsRepository;
}

function fakeUsers(findById: (id: string) => User | undefined): UsersService {
  return {
    findById: (id: string) => Promise.resolve(findById(id)),
  } as unknown as UsersService;
}

describe('ConversationsService.create', () => {
  it('rejects a conversation with yourself (400)', async () => {
    const service = new ConversationsService(
      fakeRepository(),
      fakeUsers(() => ohad),
    );

    await expect(
      service.create(ohad, { participantId: 'user-1' }),
    ).rejects.toMatchObject({ code: 'INVALID_PARTICIPANT' });
  });

  it('rejects an unknown participant (404)', async () => {
    const service = new ConversationsService(
      fakeRepository(),
      fakeUsers(() => undefined),
    );

    await expect(
      service.create(ohad, { participantId: 'ghost-99' }),
    ).rejects.toMatchObject({ code: 'USER_NOT_FOUND' });
  });

  it('always stores the pair in canonical order, whoever initiates', async () => {
    const insert = jest.fn(() => Promise.resolve());
    const peer: User = { ...ohad, id: 'user-9', email: 'z@chat.dev' };
    const service = new ConversationsService(
      fakeRepository({
        insert,
        findById: () =>
          Promise.resolve(conversationBetween('user-1', 'user-9')),
      }),
      fakeUsers(() => ({ ...ohad, id: 'user-1' })),
    );

    // user-9 starts the conversation with user-1
    await service.create(peer, { participantId: 'user-1' });

    // stored as (user-1, user-9) — sorted, NOT (initiator, peer)
    expect(insert).toHaveBeenCalledWith(expect.any(String), 'user-1', 'user-9');
  });

  it('rejects an existing pair with 409', async () => {
    const service = new ConversationsService(
      fakeRepository({ existsByPair: () => Promise.resolve(true) }),
      fakeUsers(() => ({ ...ohad, id: 'user-2' })),
    );

    await expect(
      service.create(ohad, { participantId: 'user-2' }),
    ).rejects.toMatchObject({ code: 'CONVERSATION_ALREADY_EXISTS' });
  });

  it('maps a DB unique-violation race to the same 409', async () => {
    const service = new ConversationsService(
      fakeRepository({
        existsByPair: () => Promise.resolve(false), // pre-check passes...
        insert: () =>
          // ...but the insert loses the race to a parallel request
          Promise.reject(
            Object.assign(new Error('duplicate key'), { code: '23505' }),
          ),
      }),
      fakeUsers(() => ({ ...ohad, id: 'user-2' })),
    );

    await expect(
      service.create(ohad, { participantId: 'user-2' }),
    ).rejects.toMatchObject({ code: 'CONVERSATION_ALREADY_EXISTS' });
  });
});

describe('ConversationsService.getForParticipant (the 403 rule)', () => {
  it('404 when the conversation does not exist — checked BEFORE participation', async () => {
    const service = new ConversationsService(
      fakeRepository({ findById: () => Promise.resolve(undefined) }),
      fakeUsers(() => undefined),
    );

    await expect(
      service.getForParticipant('ghost-conv', 'user-1'),
    ).rejects.toMatchObject({ code: 'CONVERSATION_NOT_FOUND' });
  });

  it('403 for an authenticated user who is not one of the two participants', async () => {
    const service = new ConversationsService(
      fakeRepository({
        findById: () =>
          Promise.resolve(conversationBetween('user-1', 'user-2')),
      }),
      fakeUsers(() => undefined),
    );

    const attempt = service.getForParticipant('conv-x', 'eve-99');

    await expect(attempt).rejects.toBeInstanceOf(AppException);
    await expect(attempt).rejects.toMatchObject({ code: 'NOT_A_PARTICIPANT' });
  });

  it('returns the conversation for a participant', async () => {
    const service = new ConversationsService(
      fakeRepository({
        findById: () =>
          Promise.resolve(conversationBetween('user-1', 'user-2')),
      }),
      fakeUsers(() => undefined),
    );

    await expect(
      service.getForParticipant('conv-x', 'user-2'),
    ).resolves.toMatchObject({ id: 'conv-x' });
  });
});

describe('ConversationsService.setPinned', () => {
  it('authorizes BEFORE writing — a 403 means the update never ran', async () => {
    const setPinned = jest.fn(() => Promise.resolve());
    const service = new ConversationsService(
      fakeRepository({
        findById: () =>
          Promise.resolve(conversationBetween('user-1', 'user-2')),
        setPinned,
      }),
      fakeUsers(() => undefined),
    );

    await expect(
      service.setPinned('conv-x', 'eve-99', { pinned: true }),
    ).rejects.toMatchObject({ code: 'NOT_A_PARTICIPANT' });

    expect(setPinned).not.toHaveBeenCalled();
  });
});
