import type { User, UserProfile } from '../../users/users.types';
import type { MessagesRepository } from '../messages.repository';
import { MessagesService } from '../messages.service';
import type { Message, StoredMessage } from '../messages.types';
import { ASSISTANT_PROFILE, ASSISTANT_SENDER_ID } from '../messages.constants';

const ohad: User = {
  id: 'user-1',
  email: 'ohad@chat.dev',
  firstName: 'Ohad',
  lastName: 'Daniel',
  passwordHash: 'hash',
  avatar: null,
};

const participants: UserProfile[] = [
  { id: 'user-1', name: 'Ohad Daniel', avatarInitials: 'OD', avatarUrl: null },
];

function storedMessage(id: string): StoredMessage {
  return {
    id,
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: `content of ${id}`,
    sentAt: new Date().toISOString(),
  };
}

function sentMessage(id: string): Message {
  return {
    id,
    conversationId: 'conv-1',
    sender: participants[0],
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
    insert: jest.fn(() => Promise.resolve(sentMessage('msg-new'))),
    insertAssistant: jest.fn(() => Promise.resolve(sentMessage('msg-ai'))),
    insertSeed: jest.fn(() => Promise.resolve()),
    count: jest.fn(() => Promise.resolve(0)),
    ...overrides,
  } as unknown as MessagesRepository;
}

function makeService(overrides: RepoOverrides = {}): MessagesService {
  return new MessagesService(fakeRepository(overrides));
}

describe('MessagesService.getPage (pagination, single-entity)', () => {
  it('defaults the limit to 30 and silently caps it at 50 (week-3 contract)', async () => {
    const findPageBefore = jest.fn(() =>
      Promise.resolve({ messages: [], hasMore: false }),
    );
    const service = makeService({ findPageBefore });

    await service.getPage('conv-1', {}, participants);
    expect(findPageBefore).toHaveBeenLastCalledWith('conv-1', undefined, 30);

    await service.getPage('conv-1', { limit: 999 }, participants);
    expect(findPageBefore).toHaveBeenLastCalledWith('conv-1', undefined, 50);
  });

  it('treats an unknown cursor as "no cursor" (newest page, week-3 behavior)', async () => {
    const findPageBefore = jest.fn(() =>
      Promise.resolve({ messages: [storedMessage('msg-3')], hasMore: false }),
    );
    const service = makeService({
      findCursorPoint: () => Promise.resolve(undefined), // cursor not found
      findPageBefore,
    });

    await service.getPage('conv-1', { cursor: 'garbage-id' }, participants);

    expect(findPageBefore).toHaveBeenCalledWith('conv-1', undefined, 30);
  });

  it('nextCursor = oldest message of the page, only when more history exists', async () => {
    const page = [storedMessage('msg-2'), storedMessage('msg-3')]; // ascending
    const withMore = makeService({
      findPageBefore: () => Promise.resolve({ messages: page, hasMore: true }),
    });
    const lastPage = makeService({
      findPageBefore: () => Promise.resolve({ messages: page, hasMore: false }),
    });

    await expect(
      withMore.getPage('conv-1', {}, participants),
    ).resolves.toMatchObject({ nextCursor: 'msg-2' });
    await expect(
      lastPage.getPage('conv-1', {}, participants),
    ).resolves.toMatchObject({ nextCursor: null });
  });

  it('resolves each sender from the conversation participants', async () => {
    const service = makeService({
      findPageBefore: () =>
        Promise.resolve({ messages: [storedMessage('msg-2')], hasMore: false }),
    });

    const { items } = await service.getPage('conv-1', {}, participants);

    expect(items[0].sender).toMatchObject({
      id: 'user-1',
      name: 'Ohad Daniel',
      avatarInitials: 'OD',
    });
  });
});

describe('MessagesService.create', () => {
  it('passes the sender as a PUBLIC profile — no hash, no email reaches the repository', async () => {
    const insert = jest.fn(() => Promise.resolve(sentMessage('msg-new')));
    const service = makeService({ insert });

    await service.create('conv-1', ohad, { content: 'hello' });

    const senderArg = (insert.mock.calls[0] as unknown[])[2];
    expect(senderArg).not.toHaveProperty('passwordHash');
    expect(senderArg).not.toHaveProperty('email');
    expect(senderArg).toMatchObject({ id: 'user-1' });
  });
});

describe('MessagesService.createAssistantMessage', () => {
  it('persists an assistant-authored reply with a generated id', async () => {
    const insertAssistant = jest.fn(() =>
      Promise.resolve(sentMessage('msg-ai')),
    );
    const service = makeService({ insertAssistant });

    await service.createAssistantMessage('conv-1', 'hello from the AI');

    expect(insertAssistant).toHaveBeenCalledWith(
      expect.any(String),
      'conv-1',
      'hello from the AI',
      undefined,
      undefined,
    );
  });
});

describe('MessagesService assistant sender resolution', () => {
  it('renders an assistant-authored message as the assistant profile', async () => {
    const assistantStored: StoredMessage = {
      id: 'msg-ai',
      conversationId: 'conv-1',
      senderId: ASSISTANT_SENDER_ID,
      content: 'I can help with that',
      sentAt: new Date().toISOString(),
    };
    const service = makeService({
      findPageBefore: () =>
        Promise.resolve({ messages: [assistantStored], hasMore: false }),
    });

    const { items } = await service.getPage('conv-1', {}, participants);

    expect(items[0].sender).toEqual(ASSISTANT_PROFILE);
  });
});
