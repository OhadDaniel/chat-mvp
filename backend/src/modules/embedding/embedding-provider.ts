export abstract class EmbeddingProvider {
  abstract embed(texts: string[]): Promise<number[][]>;
}
