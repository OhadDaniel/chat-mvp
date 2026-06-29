import { chunkText } from './chunk-text';
import { CHUNK_SIZE } from './ingest-document.constants';

describe('chunkText', () => {
  it('returns a single chunk for short text', async () => {
    const chunks = await chunkText('Mitochondria are the powerhouse of the cell.');

    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toEqual({
      chunkIndex: 0,
      text: 'Mitochondria are the powerhouse of the cell.',
    });
  });

  it('splits long text into ordered, indexed chunks', async () => {
    const longText = 'sentence. '.repeat(CHUNK_SIZE);

    const chunks = await chunkText(longText);

    expect(chunks.length).toBeGreaterThan(1);
    chunks.forEach((chunk, index) => {
      expect(chunk.chunkIndex).toBe(index);
      expect(chunk.text.length).toBeGreaterThan(0);
    });
  });
});
