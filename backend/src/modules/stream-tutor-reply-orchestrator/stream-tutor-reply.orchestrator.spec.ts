import { firstValueFrom, toArray } from 'rxjs';
import { StreamTutorReplyOrchestrator } from './stream-tutor-reply.orchestrator';
import { streamTutorAnswer } from './tutor-rag.chain';
import { EMPTY_RETRIEVAL_ANSWER } from './stream-tutor-reply.constants';
import type { ConversationsService } from '../conversations/conversations.service';
import type { MessagesService } from '../messages/messages.service';
import type { EmbeddingProvider } from '../embedding/embedding-provider';
import type { KnowledgeService } from '../knowledge/knowledge.service';
import type { ChatModelProvider } from '../chat-model/chat-model-provider';
import type { TransactionRunner } from '../mongo/transaction.runner';
import type { StoredConversation } from '../conversations/conversations.types';
import type { Message, StoredMessage } from '../messages/messages.types';
import type { RetrievedChunk } from '../knowledge/knowledge.types';
import type { User } from '../users/users.types';

jest.mock('./tutor-rag.chain', () => ({ streamTutorAnswer: jest.fn() }));

const streamTutorAnswerMock = streamTutorAnswer as jest.MockedFunction<
  typeof streamTutorAnswer
>;

const USER: User = {
  id: 'user-1',
  email: 'ohad@example.com',
  firstName: 'Ohad',
  lastName: 'Daniel',
  passwordHash: 'hash',
  avatar: null,
};

const TUTOR: StoredConversation = {
  id: 'tutor-1',
  type: 'tutor',
  participantIds: ['user-1'],
  name: 'Biology Tutor',
  avatar: null,
  lastMessage: null,
  lastMessageAt: null,
  pinnedAt: null,
};

const QUESTION: StoredMessage = {
  id: 'msg-1',
  conversationId: 'tutor-1',
  senderId: 'user-1',
  content: 'How fast is binary search?',
  sentAt: '2026-06-29T00:00:00.000Z',
};

const CHUNK: RetrievedChunk = {
  id: 'doc:0',
  docId: 'doc',
  source: 'notes.md',
  chunkIndex: 0,
  text: 'Binary search runs in O(log n) time.',
  score: 0.81,
};

async function* tokens(parts: string[]): AsyncGenerator<string> {
  for (const part of parts) {
    yield part;
  }
}

type Conversations = jest.Mocked<
  Pick<ConversationsService, 'getForParticipant' | 'updateLastMessage'>
>;
type Messages = jest.Mocked<
  Pick<MessagesService, 'loadRecent' | 'createAssistantMessage'>
>;
type Embeddings = jest.Mocked<Pick<EmbeddingProvider, 'embed'>>;
type Knowledge = jest.Mocked<Pick<KnowledgeService, 'search'>>;

function buildReply(content: string): Message {
  return {
    id: 'reply-1',
    conversationId: 'tutor-1',
    sender: { id: 'assistant', name: 'Tutor', avatarInitials: 'T', avatarUrl: null },
    content,
    sentAt: '2026-06-29T00:01:00.000Z',
    status: 'sent',
  };
}

describe('StreamTutorReplyOrchestrator', () => {
  let conversations: Conversations;
  let messages: Messages;
  let embeddings: Embeddings;
  let knowledge: Knowledge;
  let chatModel: jest.Mocked<Pick<ChatModelProvider, 'getChatModel'>>;
  let transactionRunner: TransactionRunner;
  let orchestrator: StreamTutorReplyOrchestrator;

  beforeEach(() => {
    streamTutorAnswerMock.mockReset();
    conversations = {
      getForParticipant: jest.fn().mockResolvedValue(TUTOR),
      updateLastMessage: jest.fn().mockResolvedValue(undefined),
    };
    messages = {
      loadRecent: jest.fn().mockResolvedValue([QUESTION]),
      createAssistantMessage: jest
        .fn()
        .mockImplementation((_id: string, content: string) =>
          Promise.resolve(buildReply(content)),
        ),
    };
    embeddings = { embed: jest.fn().mockResolvedValue([[0.1, 0.2]]) };
    knowledge = { search: jest.fn().mockResolvedValue([CHUNK]) };
    chatModel = { getChatModel: jest.fn().mockReturnValue({}) };
    transactionRunner = {
      run: jest.fn((work: (session: unknown) => Promise<unknown>) => work({})),
    } as unknown as TransactionRunner;

    orchestrator = new StreamTutorReplyOrchestrator(
      conversations as unknown as ConversationsService,
      messages as unknown as MessagesService,
      embeddings as unknown as EmbeddingProvider,
      knowledge as unknown as KnowledgeService,
      chatModel as unknown as ChatModelProvider,
      transactionRunner,
    );
  });

  it('streams a grounded answer with citations from retrieved chunks', async () => {
    streamTutorAnswerMock.mockResolvedValue(tokens(['Binary', ' search']));

    const events = await firstValueFrom(
      orchestrator.execute('tutor-1', USER).pipe(toArray()),
    );

    expect(embeddings.embed).toHaveBeenCalledWith([QUESTION.content]);
    expect(knowledge.search).toHaveBeenCalledWith('user-1', 'tutor-1', [
      0.1, 0.2,
    ]);

    const deltas = events.filter((event) => event.type === 'delta');
    expect(deltas.map((event) => (event.data as { text: string }).text)).toEqual(
      ['Binary', ' search'],
    );

    const done = events.find((event) => event.type === 'done');
    expect(done?.data).toEqual({
      messageId: 'reply-1',
      citations: [
        {
          chunkId: 'doc:0',
          documentName: 'notes.md',
          text: 'Binary search runs in O(log n) time.',
        },
      ],
    });
  });

  it('does not call the LLM when retrieval is empty and replies it does not know', async () => {
    knowledge.search.mockResolvedValue([]);

    const events = await firstValueFrom(
      orchestrator.execute('tutor-1', USER).pipe(toArray()),
    );

    expect(streamTutorAnswerMock).not.toHaveBeenCalled();
    const deltas = events.filter((event) => event.type === 'delta');
    expect(deltas.map((event) => (event.data as { text: string }).text)).toEqual(
      [EMPTY_RETRIEVAL_ANSWER],
    );
    const done = events.find((event) => event.type === 'done');
    expect((done?.data as { citations: unknown[] }).citations).toEqual([]);
  });

  it('emits an error when the conversation is not a tutor', async () => {
    conversations.getForParticipant.mockResolvedValue({
      ...TUTOR,
      type: 'assistant',
    } as StoredConversation);

    const events = await firstValueFrom(
      orchestrator.execute('tutor-1', USER).pipe(toArray()),
    );

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('error');
    expect(knowledge.search).not.toHaveBeenCalled();
  });
});
