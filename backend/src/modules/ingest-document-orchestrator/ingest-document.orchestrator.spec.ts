import { createHash } from 'node:crypto';
import { IngestDocumentOrchestrator } from './ingest-document.orchestrator';
import { InvalidDocumentError } from '../documents/errors/invalid-document.error';
import type { ConversationsService } from '../conversations/conversations.service';
import type { DocumentsService } from '../documents/documents.service';
import type { EmbeddingProvider } from '../embedding/embedding-provider';
import type { KnowledgeService } from '../knowledge/knowledge.service';
import type { TransactionRunner } from '../mongo/transaction.runner';
import type { StoredDocument } from '../documents/documents.types';
import type { UploadedDocumentFile } from './ingest-document.types';

function buildFile(
  overrides: Partial<UploadedDocumentFile> = {},
): UploadedDocumentFile {
  return {
    originalname: 'notes.md',
    mimetype: 'text/markdown',
    size: 42,
    buffer: Buffer.from('Mitochondria are the powerhouse of the cell.'),
    ...overrides,
  };
}

function buildDocument(overrides: Partial<StoredDocument> = {}): StoredDocument {
  return {
    id: 'doc-1',
    userId: 'user-1',
    tutorId: 'tutor-1',
    source: 'notes.md',
    contentHash: null,
    status: 'pending',
    chunkCount: 0,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function hashOf(file: UploadedDocumentFile): string {
  return createHash('sha256').update(file.buffer.toString('utf8')).digest('hex');
}

type DocumentsMock = jest.Mocked<
  Pick<
    DocumentsService,
    'getOrCreate' | 'markIngested' | 'assertWithinDocumentLimit'
  >
>;
type KnowledgeMock = jest.Mocked<
  Pick<KnowledgeService, 'storeChunks' | 'deleteDocument'>
>;
type EmbeddingMock = jest.Mocked<Pick<EmbeddingProvider, 'embed'>>;
type ConversationsMock = jest.Mocked<
  Pick<ConversationsService, 'assertTutorOwner'>
>;

describe('IngestDocumentOrchestrator', () => {
  let conversations: ConversationsMock;
  let documents: DocumentsMock;
  let knowledge: KnowledgeMock;
  let embedding: EmbeddingMock;
  let transactionRunner: TransactionRunner;
  let orchestrator: IngestDocumentOrchestrator;

  beforeEach(() => {
    conversations = {
      assertTutorOwner: jest.fn().mockResolvedValue(undefined),
    };
    documents = {
      getOrCreate: jest.fn(),
      markIngested: jest.fn().mockResolvedValue(undefined),
      assertWithinDocumentLimit: jest.fn().mockResolvedValue(undefined),
    };
    knowledge = {
      storeChunks: jest.fn().mockResolvedValue(undefined),
      deleteDocument: jest.fn().mockResolvedValue(0),
    };
    embedding = {
      embed: jest
        .fn()
        .mockImplementation((texts: string[]) =>
          Promise.resolve(texts.map(() => [0.1, 0.2])),
        ),
    };
    transactionRunner = {
      run: jest.fn((work: (session: unknown) => Promise<unknown>) => work({})),
    } as unknown as TransactionRunner;

    orchestrator = new IngestDocumentOrchestrator(
      conversations as unknown as ConversationsService,
      documents as unknown as DocumentsService,
      knowledge as unknown as KnowledgeService,
      embedding as unknown as EmbeddingProvider,
      transactionRunner,
    );
  });

  it('rejects when the tutor is at its document limit', async () => {
    documents.assertWithinDocumentLimit.mockRejectedValue(
      new Error('limit reached'),
    );

    await expect(
      orchestrator.execute('user-1', 'tutor-1', buildFile()),
    ).rejects.toThrow('limit reached');
    expect(documents.getOrCreate).not.toHaveBeenCalled();
    expect(embedding.embed).not.toHaveBeenCalled();
  });

  it('rejects when the tutor is not owned by the user', async () => {
    conversations.assertTutorOwner.mockRejectedValue(new Error('not owner'));

    await expect(
      orchestrator.execute('user-1', 'tutor-1', buildFile()),
    ).rejects.toThrow('not owner');
    expect(documents.getOrCreate).not.toHaveBeenCalled();
    expect(embedding.embed).not.toHaveBeenCalled();
  });

  it('rejects an unsupported file type before doing any work', async () => {
    await expect(
      orchestrator.execute('user-1', 'tutor-1', buildFile({ originalname: 'a.pdf' })),
    ).rejects.toBeInstanceOf(InvalidDocumentError);
    expect(documents.getOrCreate).not.toHaveBeenCalled();
  });

  it('ingests a new document: embeds, replaces chunks, marks ready', async () => {
    const file = buildFile();
    documents.getOrCreate.mockResolvedValue(buildDocument());

    const result = await orchestrator.execute('user-1', 'tutor-1', file);

    expect(embedding.embed).toHaveBeenCalledTimes(1);
    expect(knowledge.deleteDocument).toHaveBeenCalledWith(
      'user-1',
      'tutor-1',
      'doc-1',
      {},
    );
    expect(knowledge.storeChunks).toHaveBeenCalledTimes(1);
    expect(documents.markIngested).toHaveBeenCalledWith(
      'doc-1',
      hashOf(file),
      1,
      {},
    );
    expect(result.document).toEqual({
      id: 'doc-1',
      source: 'notes.md',
      status: 'ready',
      chunkCount: 1,
      createdAt: expect.any(String),
    });
  });

  it('skips re-ingestion when the document is unchanged', async () => {
    const file = buildFile();
    documents.getOrCreate.mockResolvedValue(
      buildDocument({ status: 'ready', contentHash: hashOf(file), chunkCount: 1 }),
    );

    const result = await orchestrator.execute('user-1', 'tutor-1', file);

    expect(embedding.embed).not.toHaveBeenCalled();
    expect(knowledge.storeChunks).not.toHaveBeenCalled();
    expect(transactionRunner.run).not.toHaveBeenCalled();
    expect(result.document.status).toBe('ready');
  });

  it('re-ingests when the same filename has new content', async () => {
    const file = buildFile({ buffer: Buffer.from('Completely different text.') });
    documents.getOrCreate.mockResolvedValue(
      buildDocument({ status: 'ready', contentHash: 'old-hash', chunkCount: 9 }),
    );

    await orchestrator.execute('user-1', 'tutor-1', file);

    expect(embedding.embed).toHaveBeenCalledTimes(1);
    expect(knowledge.storeChunks).toHaveBeenCalledTimes(1);
  });
});
