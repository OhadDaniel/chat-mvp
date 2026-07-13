import { ListDocumentsOrchestrator } from './list-documents.orchestrator';
import type { ConversationsService } from '../conversations/conversations.service';
import type { DocumentsService } from '../documents/documents.service';
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

describe('ListDocumentsOrchestrator', () => {
  let conversations: jest.Mocked<
    Pick<ConversationsService, 'assertTutorOwner'>
  >;
  let documents: jest.Mocked<Pick<DocumentsService, 'list'>>;
  let orchestrator: ListDocumentsOrchestrator;

  beforeEach(() => {
    conversations = {
      assertTutorOwner: jest.fn().mockResolvedValue(undefined),
    };
    documents = {
      list: jest.fn().mockResolvedValue([buildStored()]),
    };
    orchestrator = new ListDocumentsOrchestrator(
      conversations as unknown as ConversationsService,
      documents as unknown as DocumentsService,
    );
  });

  it('checks tutor ownership, then returns mapped summaries', async () => {
    const result = await orchestrator.execute('user-1', 'tutor-1');

    expect(conversations.assertTutorOwner).toHaveBeenCalledWith(
      'tutor-1',
      'user-1',
    );
    expect(documents.list).toHaveBeenCalledWith('user-1', 'tutor-1');
    expect(result).toEqual({
      documents: [
        {
          id: 'doc-1',
          source: 'notes.md',
          status: 'ready',
          chunkCount: 3,
          createdAt: '2026-06-29T00:00:00.000Z',
        },
      ],
    });
  });

  it('does not list when the tutor is not owned', async () => {
    conversations.assertTutorOwner.mockRejectedValue(new Error('not owner'));

    await expect(orchestrator.execute('user-1', 'tutor-1')).rejects.toThrow(
      'not owner',
    );
    expect(documents.list).not.toHaveBeenCalled();
  });
});
