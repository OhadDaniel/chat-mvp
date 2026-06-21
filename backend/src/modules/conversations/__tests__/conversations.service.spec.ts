import { AppException } from '../../../common/errors/app.exception';
import type { ConversationsRepository } from '../conversations.repository';
import { ConversationsService } from '../conversations.service';
import type { StoredConversation } from '../conversations.types';

function storedBetween(a: string, b: string): StoredConversation {
  return {
    id: 'conv-x',
    participantIds: [a, b],
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
    findParticipantIds: jest.fn(() => Promise.resolve(undefined)),
    insert: jest.fn(() => Promise.resolve()),
    setPinned: jest.fn(() => Promise.resolve()),
    updateLastMessage: jest.fn(() => Promise.resolve()),
    count: jest.fn(() => Promise.resolve(0)),
    ...overrides,
  } as unknown as ConversationsRepository;
}

describe('ConversationsService.create (pair rules, single-entity)', () => {
  it('rejects a conversation with yourself (400)', async () => {
    const service = new ConversationsService(fakeRepository());

    await expect(service.create('user-1', 'user-1')).rejects.toMatchObject({
      code: 'INVALID_PARTICIPANT',
    });
  });

  it('stores participant ids in canonical order with a canonical pairKey', async () => {
    const insert = jest.fn(() => Promise.resolve());
    const service = new ConversationsService(
      fakeRepository({
        insert,
        findById: () => Promise.resolve(storedBetween('user-1', 'user-9')),
      }),
    );

    // user-9 initiates the conversation with user-1
    await service.create('user-9', 'user-1');

    // stored as (user-1, user-9) — sorted, NOT (initiator, peer)
    expect(insert).toHaveBeenCalledWith(
      expect.any(String),
      ['user-1', 'user-9'],
      'user-1:user-9',
    );
  });

  it('maps the unique-index violation (duplicate pair) to a 409', async () => {
    // The DB unique index on pairKey is the guard; a duplicate insert — from a
    // second request or a concurrent race — is rejected and surfaces as 409.
    const service = new ConversationsService(
      fakeRepository({
        insert: () =>
          Promise.reject(
            Object.assign(new Error('duplicate key'), { code: 11000 }),
          ),
      }),
    );

    await expect(service.create('user-1', 'user-2')).rejects.toMatchObject({
      code: 'CONVERSATION_ALREADY_EXISTS',
    });
  });
});

describe('ConversationsService.getForParticipant (the 403 rule)', () => {
  it('404 when the conversation does not exist — checked BEFORE participation', async () => {
    const service = new ConversationsService(
      fakeRepository({ findById: () => Promise.resolve(undefined) }),
    );

    await expect(
      service.getForParticipant('ghost-conv', 'user-1'),
    ).rejects.toMatchObject({ code: 'CONVERSATION_NOT_FOUND' });
  });

  it('403 for an authenticated user who is not one of the two participants', async () => {
    const service = new ConversationsService(
      fakeRepository({
        findById: () => Promise.resolve(storedBetween('user-1', 'user-2')),
      }),
    );

    const attempt = service.getForParticipant('conv-x', 'eve-99');

    await expect(attempt).rejects.toBeInstanceOf(AppException);
    await expect(attempt).rejects.toMatchObject({ code: 'NOT_A_PARTICIPANT' });
  });

  it('returns the conversation for a participant', async () => {
    const service = new ConversationsService(
      fakeRepository({
        findById: () => Promise.resolve(storedBetween('user-1', 'user-2')),
      }),
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
        findParticipantIds: () => Promise.resolve(['user-1', 'user-2']),
        setPinned,
      }),
    );

    await expect(
      service.setPinned('conv-x', 'eve-99', { pinned: true }),
    ).rejects.toMatchObject({ code: 'NOT_A_PARTICIPANT' });

    expect(setPinned).not.toHaveBeenCalled();
  });
});
