import { AppException } from '../../../common/errors/app.exception';
import type { ConversationsRepository } from '../conversations.repository';
import { ConversationsService } from '../conversations.service';
import type { StoredConversation } from '../conversations.types';

function storedBetween(a: string, b: string): StoredConversation {
  return {
    id: 'conv-x',
    type: 'direct',
    participantIds: [a, b],
    lastMessage: null,
    lastMessageAt: null,
    pinnedAt: null,
  };
}

function storedGroup(): StoredConversation {
  return {
    id: 'conv-g',
    type: 'group',
    name: 'Fellowship Crew',
    createdBy: 'user-1',
    avatar: null,
    participantIds: ['user-1', 'user-3', 'user-4'],
    lastMessage: null,
    lastMessageAt: null,
    pinnedAt: null,
  };
}

function storedAssistant(userId: string): StoredConversation {
  return {
    id: 'conv-ai',
    type: 'assistant',
    participantIds: [userId],
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
    insertDirect: jest.fn(() => Promise.resolve()),
    insertGroup: jest.fn(() => Promise.resolve()),
    insertAssistant: jest.fn(() => Promise.resolve()),
    findAssistantByUserId: jest.fn(() => Promise.resolve(undefined)),
    setPinned: jest.fn(() => Promise.resolve()),
    setGroupName: jest.fn(() => Promise.resolve()),
    setGroupAvatar: jest.fn(() => Promise.resolve()),
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
    const insertDirect = jest.fn(() => Promise.resolve());
    const service = new ConversationsService(
      fakeRepository({
        insertDirect,
        findById: () => Promise.resolve(storedBetween('user-1', 'user-9')),
      }),
    );

    // user-9 initiates the conversation with user-1
    await service.create('user-9', 'user-1');

    // stored as (user-1, user-9) — sorted, NOT (initiator, peer)
    expect(insertDirect).toHaveBeenCalledWith(
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
        insertDirect: () =>
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

describe('ConversationsService — group conversations pass through unchanged', () => {
  it('list returns a stored group as-is (no pair logic touches it)', async () => {
    const group = storedGroup();
    const service = new ConversationsService(
      fakeRepository({ findAllByUserId: () => Promise.resolve([group]) }),
    );

    await expect(service.list('user-1')).resolves.toEqual([group]);
  });

  it('getForParticipant authorizes a group member by participant ids', async () => {
    const group = storedGroup(); // members: user-1, user-3, user-4
    const service = new ConversationsService(
      fakeRepository({ findById: () => Promise.resolve(group) }),
    );

    await expect(
      service.getForParticipant('conv-g', 'user-3'),
    ).resolves.toMatchObject({ id: 'conv-g', type: 'group' });
    await expect(
      service.getForParticipant('conv-g', 'user-2'),
    ).rejects.toMatchObject({ code: 'NOT_A_PARTICIPANT' });
  });

  it('createGroup stores the creator + members (deduped, creator first) and records the creator', async () => {
    const insertGroup = jest.fn(() => Promise.resolve());
    const service = new ConversationsService(
      fakeRepository({
        insertGroup,
        findById: () => Promise.resolve(storedGroup()),
      }),
    );

    // creator passed self in the list, and a dup — both collapse
    await service.createGroup('user-1', 'Crew', ['user-2', 'user-1', 'user-3']);

    expect(insertGroup).toHaveBeenCalledWith(
      expect.any(String),
      ['user-1', 'user-2', 'user-3'],
      'Crew',
      'user-1',
    );
  });

  it('renameGroup lets the creator rename and persists the new title', async () => {
    const setGroupName = jest.fn(() => Promise.resolve());
    const service = new ConversationsService(
      fakeRepository({
        setGroupName,
        findById: () => Promise.resolve(storedGroup()), // createdBy: user-1
      }),
    );

    await service.renameGroup('conv-g', 'user-1', 'Renamed');

    expect(setGroupName).toHaveBeenCalledWith('conv-g', 'Renamed');
  });

  it('renameGroup blocks a non-creator (403) and writes nothing', async () => {
    const setGroupName = jest.fn();
    const service = new ConversationsService(
      fakeRepository({
        setGroupName,
        findById: () => Promise.resolve(storedGroup()), // member user-3 is NOT the creator
      }),
    );

    await expect(
      service.renameGroup('conv-g', 'user-3', 'Nope'),
    ).rejects.toMatchObject({ code: 'NOT_GROUP_OWNER' });
    expect(setGroupName).not.toHaveBeenCalled();
  });

  it('renameGroup 404s on a DM — there is no title to edit', async () => {
    const setGroupName = jest.fn();
    const service = new ConversationsService(
      fakeRepository({
        setGroupName,
        findById: () => Promise.resolve(storedBetween('user-1', 'user-2')),
      }),
    );

    await expect(
      service.renameGroup('conv-x', 'user-1', 'Nope'),
    ).rejects.toMatchObject({ code: 'CONVERSATION_NOT_FOUND' });
    expect(setGroupName).not.toHaveBeenCalled();
  });

  it('setGroupAvatar lets the creator persist a photo; non-creator → 403', async () => {
    const setGroupAvatar = jest.fn(() => Promise.resolve());
    const service = new ConversationsService(
      fakeRepository({
        setGroupAvatar,
        findById: () => Promise.resolve(storedGroup()), // createdBy: user-1
      }),
    );
    const avatar = { storageKey: 'groups/conv-g/avatar', srcUrl: 'https://cdn/g' };

    await service.setGroupAvatar('conv-g', 'user-1', avatar);
    expect(setGroupAvatar).toHaveBeenCalledWith('conv-g', avatar);

    await expect(
      service.setGroupAvatar('conv-g', 'user-3', avatar),
    ).rejects.toMatchObject({ code: 'NOT_GROUP_OWNER' });
  });

  it('removeGroupAvatar lets the creator clear the photo (null)', async () => {
    const setGroupAvatar = jest.fn(() => Promise.resolve());
    const service = new ConversationsService(
      fakeRepository({
        setGroupAvatar,
        findById: () => Promise.resolve(storedGroup()),
      }),
    );

    await service.removeGroupAvatar('conv-g', 'user-1');
    expect(setGroupAvatar).toHaveBeenCalledWith('conv-g', null);
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

describe('ConversationsService.createAssistant (get-or-create, one per user)', () => {
  it('creates the thread for the caller when none exists yet', async () => {
    const insertAssistant = jest.fn(() => Promise.resolve());
    const service = new ConversationsService(
      fakeRepository({
        insertAssistant,
        findById: () => Promise.resolve(storedAssistant('user-1')),
      }),
    );

    const result = await service.createAssistant('user-1');

    expect(insertAssistant).toHaveBeenCalledWith(expect.any(String), 'user-1');
    expect(result).toMatchObject({
      type: 'assistant',
      participantIds: ['user-1'],
    });
  });

  it('returns the existing thread when the unique index rejects a duplicate insert', async () => {
    const existing = storedAssistant('user-1');
    const service = new ConversationsService(
      fakeRepository({
        insertAssistant: () =>
          Promise.reject(
            Object.assign(new Error('duplicate key'), { code: 11000 }),
          ),
        findAssistantByUserId: () => Promise.resolve(existing),
      }),
    );

    await expect(service.createAssistant('user-1')).resolves.toEqual(existing);
  });

  it('rethrows when the insert fails for a non-duplicate reason', async () => {
    const findAssistantByUserId = jest.fn(() => Promise.resolve(undefined));
    const service = new ConversationsService(
      fakeRepository({
        findAssistantByUserId,
        insertAssistant: () => Promise.reject(new Error('db down')),
      }),
    );

    await expect(service.createAssistant('user-1')).rejects.toThrow('db down');
    expect(findAssistantByUserId).not.toHaveBeenCalled();
  });
});
