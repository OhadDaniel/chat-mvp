import { ConfigService } from '@nestjs/config';
import { OpenAIEmbeddingProvider } from '../openai-embedding.provider';
import { EmbeddingUnavailableError } from '../errors/embedding-unavailable.error';
import { DEFAULT_EMBEDDING_MODEL } from '../embedding.constants';

const mockEmbeddingsCreate = jest.fn();

jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    embeddings: { create: mockEmbeddingsCreate },
  })),
}));

function configWith(
  values: Record<string, string | undefined>,
): ConfigService {
  return {
    get: (key: string): string | undefined => values[key],
  } as unknown as ConfigService;
}

describe('OpenAIEmbeddingProvider', () => {
  beforeEach(() => {
    mockEmbeddingsCreate.mockReset();
  });

  it('returns one vector per input, ordered by response index', async () => {
    mockEmbeddingsCreate.mockResolvedValue({
      data: [
        { index: 1, embedding: [0.3, 0.4] },
        { index: 0, embedding: [0.1, 0.2] },
      ],
    });
    const provider = new OpenAIEmbeddingProvider(
      configWith({ OPENAI_API_KEY: 'sk-test' }),
    );

    const vectors = await provider.embed(['first', 'second']);

    expect(vectors).toEqual([
      [0.1, 0.2],
      [0.3, 0.4],
    ]);
    expect(mockEmbeddingsCreate).toHaveBeenCalledWith({
      model: DEFAULT_EMBEDDING_MODEL,
      input: ['first', 'second'],
    });
  });

  it('uses a custom embedding model when configured', async () => {
    mockEmbeddingsCreate.mockResolvedValue({
      data: [{ index: 0, embedding: [0.1] }],
    });
    const provider = new OpenAIEmbeddingProvider(
      configWith({
        OPENAI_API_KEY: 'sk-test',
        OPENAI_EMBEDDING_MODEL: 'text-embedding-3-large',
      }),
    );

    await provider.embed(['only']);

    expect(mockEmbeddingsCreate).toHaveBeenCalledWith({
      model: 'text-embedding-3-large',
      input: ['only'],
    });
  });

  it('throws when no API key is configured and never calls OpenAI', async () => {
    const provider = new OpenAIEmbeddingProvider(configWith({}));

    await expect(provider.embed(['x'])).rejects.toBeInstanceOf(
      EmbeddingUnavailableError,
    );
    expect(mockEmbeddingsCreate).not.toHaveBeenCalled();
  });
});
