import { DeleteDocumentOrchestrator } from './delete-document.orchestrator';
import { DocumentNotFoundError } from '../documents/errors/document-not-found.error';
import type { DocumentsService } from '../documents/documents.service';
import type { KnowledgeService } from '../knowledge/knowledge.service';
import type { TransactionRunner } from '../mongo/transaction.runner';
import type { StoredDocument } from '../documents/documents.types';

function buildStored(overrides: Partial<StoredDocument> = {}): StoredDocument {
  return {
    id: 'doc-1',
    userId: 'user-1',
    tutorId: 'tutor-1',
    source: 'notes.md',
    contentHash: 'abc',
    status: 'ready',
    chunkCount: 3,
    createdAt: '2026-06-29T00:00:00.000Z',
    ...overrides,
  };
}

describe('DeleteDocumentOrchestrator', () => {
  let documents: jest.Mocked<Pick<DocumentsService, 'getOwned' | 'delete'>>;
  let knowledge: jest.Mocked<Pick<KnowledgeService, 'deleteDocument'>>;
  let transactionRunner: TransactionRunner;
  let orchestrator: DeleteDocumentOrchestrator;

  beforeEach(() => {
    documents = {
      getOwned: jest.fn().mockResolvedValue(buildStored()),
      delete: jest.fn().mockResolvedValue(undefined),
    };
    knowledge = {
      deleteDocument: jest.fn().mockResolvedValue(3),
    };
    transactionRunner = {
      run: jest.fn((work: (session: unknown) => Promise<unknown>) => work({})),
    } as unknown as TransactionRunner;
    orchestrator = new DeleteDocumentOrchestrator(
      documents as unknown as DocumentsService,
      knowledge as unknown as KnowledgeService,
      transactionRunner,
    );
  });

  it('checks ownership, then deletes the chunks and the record', async () => {
    await orchestrator.execute('user-1', 'doc-1');

    expect(documents.getOwned).toHaveBeenCalledWith('user-1', 'doc-1');
    expect(knowledge.deleteDocument).toHaveBeenCalledWith(
      'user-1',
      'tutor-1',
      'doc-1',
      {},
    );
    expect(documents.delete).toHaveBeenCalledWith('user-1', 'doc-1', {});
  });

  it('propagates a not-found error and deletes nothing', async () => {
    documents.getOwned.mockRejectedValue(new DocumentNotFoundError());

    await expect(
      orchestrator.execute('user-1', 'missing'),
    ).rejects.toBeInstanceOf(DocumentNotFoundError);
    expect(knowledge.deleteDocument).not.toHaveBeenCalled();
    expect(documents.delete).not.toHaveBeenCalled();
  });
});
