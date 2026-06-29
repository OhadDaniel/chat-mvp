import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { buildOpenAiClient } from '../../common/openai/build-openai-client';
import { DEFAULT_EMBEDDING_MODEL } from './embedding.constants';
import { EmbeddingProvider } from './embedding-provider';
import { EmbeddingUnavailableError } from './errors/embedding-unavailable.error';

@Injectable()
export class OpenAIEmbeddingProvider extends EmbeddingProvider {
  private readonly apiKey: string | undefined;
  private readonly model: string;
  private client: OpenAI | undefined;

  constructor(configService: ConfigService) {
    super();
    this.apiKey = configService.get<string>('OPENAI_API_KEY');
    this.model =
      configService.get<string>('OPENAI_EMBEDDING_MODEL') ??
      DEFAULT_EMBEDDING_MODEL;
  }

  async embed(texts: string[]): Promise<number[][]> {
    const response = await this.getClient().embeddings.create({
      model: this.model,
      input: texts,
    });
    return [...response.data]
      .sort((a, b) => a.index - b.index)
      .map((item) => item.embedding);
  }

  private getClient(): OpenAI {
    if (!this.client) {
      this.client = buildOpenAiClient(this.apiKey, () => {
        throw new EmbeddingUnavailableError();
      });
    }
    return this.client;
  }
}
