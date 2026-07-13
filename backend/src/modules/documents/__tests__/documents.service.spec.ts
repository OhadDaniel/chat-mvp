import { DocumentsService } from '../documents.service';
import { MAX_DOCUMENTS_PER_TUTOR } from '../documents.constants';
import { DocumentLimitReachedError } from '../errors/document-limit-reached.error';
import { DocumentNotFoundError } from '../errors/document-not-found.error';
import type { DocumentsRepository } from '../documents.repository';
import type { StoredDocument } from '../documents.types';

function buildStored(overrides: Partial<StoredDocument> = {}): StoredDocument {
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

type RepositoryMock = jest.Mocked<
  Pick<
    DocumentsRepository,
    | 'insert'
    | 'findByUserTutorSource'
    | 'findAllByUserAndTutor'
    | 'findOwned'
    | 'markIngested'
    | 'deleteOwned'
    | 'countByTutor'
  >
>;

describe('DocumentsService', () => {
  let repository: RepositoryMock;
  let service: DocumentsService;

  beforeEach(() => {
    repository = {
      insert: jest.fn(),
      findByUserTutorSource: jest.fn(),
      findAllByUserAndTutor: jest.fn().mockResolvedValue([]),
      findOwned: jest.fn(),
      markIngested: jest.fn().mockResolvedValue(undefined),
      deleteOwned: jest.fn().mockResolvedValue(1),
      countByTutor: jest.fn().mockResolvedValue(0),
    };
    service = new DocumentsService(
      repository as unknown as DocumentsRepository,
    );
  });

  it('creates a new document when none exists', async () => {
    const created = buildStored();
    repository.insert.mockResolvedValue(created);

    const result = await service.getOrCreate('user-1', 'tutor-1', 'notes.md');

    expect(result).toBe(created);
    expect(repository.findByUserTutorSource).not.toHaveBeenCalled();
  });

  it('returns the existing document on a duplicate-key conflict', async () => {
    const existing = buildStored({ status: 'ready', contentHash: 'abc' });
    repository.insert.mockRejectedValue({ code: 11000 });
    repository.findByUserTutorSource.mockResolvedValue(existing);

    const result = await service.getOrCreate('user-1', 'tutor-1', 'notes.md');

    expect(result).toBe(existing);
  });

  it('rethrows errors that are not duplicate-key conflicts', async () => {
    repository.insert.mockRejectedValue(new Error('boom'));

    await expect(
      service.getOrCreate('user-1', 'tutor-1', 'notes.md'),
    ).rejects.toThrow('boom');
  });

  it('throws DocumentNotFoundError when the document is not owned', async () => {
    repository.findOwned.mockResolvedValue(undefined);

    await expect(service.getOwned('user-1', 'missing')).rejects.toBeInstanceOf(
      DocumentNotFoundError,
    );
  });

  it('returns the document when it is owned', async () => {
    const doc = buildStored();
    repository.findOwned.mockResolvedValue(doc);

    await expect(service.getOwned('user-1', 'doc-1')).resolves.toBe(doc);
  });

  it('lists documents scoped to the user and tutor', async () => {
    await service.list('user-1', 'tutor-1');

    expect(repository.findAllByUserAndTutor).toHaveBeenCalledWith(
      'user-1',
      'tutor-1',
    );
  });

  it('forwards markIngested to the repository', async () => {
    await service.markIngested('doc-1', 'hash', 5);

    expect(repository.markIngested).toHaveBeenCalledWith(
      'doc-1',
      'hash',
      5,
      undefined,
    );
  });

  it('forwards scoped deletes to the repository', async () => {
    await service.delete('user-1', 'doc-1');

    expect(repository.deleteOwned).toHaveBeenCalledWith(
      'user-1',
      'doc-1',
      undefined,
    );
  });

  it('allows re-uploading an existing document without counting', async () => {
    repository.findByUserTutorSource.mockResolvedValue(buildStored());

    await expect(
      service.assertWithinDocumentLimit('user-1', 'tutor-1', 'notes.md'),
    ).resolves.toBeUndefined();
    expect(repository.countByTutor).not.toHaveBeenCalled();
  });

  it('allows a new document when under the limit', async () => {
    repository.findByUserTutorSource.mockResolvedValue(undefined);
    repository.countByTutor.mockResolvedValue(MAX_DOCUMENTS_PER_TUTOR - 1);

    await expect(
      service.assertWithinDocumentLimit('user-1', 'tutor-1', 'new.md'),
    ).resolves.toBeUndefined();
  });

  it('rejects a new document when the tutor is at the limit', async () => {
    repository.findByUserTutorSource.mockResolvedValue(undefined);
    repository.countByTutor.mockResolvedValue(MAX_DOCUMENTS_PER_TUTOR);

    await expect(
      service.assertWithinDocumentLimit('user-1', 'tutor-1', 'new.md'),
    ).rejects.toBeInstanceOf(DocumentLimitReachedError);
  });
});
