import { KnowledgeService } from '../knowledge.service';
import { InvalidChunkError } from '../errors/invalid-chunk.error';
import { DEFAULT_TOP_K, EMBEDDING_DIMENSIONS } from '../knowledge.constants';
import type { KnowledgeRepository } from '../knowledge.repository';
import type { KnowledgeChunkInput, RetrievedChunk } from '../knowledge.types';

function buildEmbedding(): number[] {
  return new Array<number>(EMBEDDING_DIMENSIONS).fill(0);
}

function buildChunk(
  overrides: Partial<KnowledgeChunkInput> = {},
): KnowledgeChunkInput {
  return {
    userId: 'user-1',
    tutorId: 'tutor-1',
    docId: 'doc-1',
    source: 'notes.md',
    chunkIndex: 0,
    text: 'hello world',
    embedding: buildEmbedding(),
    ...overrides,
  };
}

type RepositoryMock = jest.Mocked<
  Pick<KnowledgeRepository, 'upsertMany' | 'vectorSearch' | 'deleteByDoc'>
>;

describe('KnowledgeService', () => {
  let repository: RepositoryMock;
  let service: KnowledgeService;

  beforeEach(() => {
    repository = {
      upsertMany: jest.fn().mockResolvedValue(undefined),
      vectorSearch: jest.fn().mockResolvedValue([] as RetrievedChunk[]),
      deleteByDoc: jest.fn().mockResolvedValue(0),
    };
    service = new KnowledgeService(repository as unknown as KnowledgeRepository);
  });

  it('stores valid chunks', async () => {
    const chunks = [buildChunk()];
    await service.storeChunks(chunks);
    expect(repository.upsertMany).toHaveBeenCalledWith(chunks, undefined);
  });

  it('rejects empty chunk text and does not write', async () => {
    await expect(
      service.storeChunks([buildChunk({ text: '   ' })]),
    ).rejects.toBeInstanceOf(InvalidChunkError);
    expect(repository.upsertMany).not.toHaveBeenCalled();
  });

  it('rejects a chunk whose embedding has the wrong dimensions', async () => {
    await expect(
      service.storeChunks([buildChunk({ embedding: [0, 1, 2] })]),
    ).rejects.toBeInstanceOf(InvalidChunkError);
  });

  it('passes userId and tutorId into the scoped search', async () => {
    const embedding = buildEmbedding();
    await service.search('user-1', 'tutor-1', embedding, 3);
    expect(repository.vectorSearch).toHaveBeenCalledWith(
      'user-1',
      'tutor-1',
      embedding,
      3,
    );
  });

  it('uses the default top-K when k is omitted', async () => {
    await service.search('user-1', 'tutor-1', buildEmbedding());
    expect(repository.vectorSearch).toHaveBeenCalledWith(
      'user-1',
      'tutor-1',
      expect.any(Array),
      DEFAULT_TOP_K,
    );
  });

  it('forwards scoped deletes to the repository', async () => {
    await service.deleteDocument('user-1', 'tutor-1', 'doc-1');
    expect(repository.deleteByDoc).toHaveBeenCalledWith(
      'user-1',
      'tutor-1',
      'doc-1',
      undefined,
    );
  });
});
