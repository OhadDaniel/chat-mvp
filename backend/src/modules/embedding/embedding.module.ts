import { Module } from '@nestjs/common';
import { EmbeddingProvider } from './embedding-provider';
import { OpenAIEmbeddingProvider } from './openai-embedding.provider';

@Module({
  providers: [
    { provide: EmbeddingProvider, useClass: OpenAIEmbeddingProvider },
  ],
  exports: [EmbeddingProvider],
})
export class EmbeddingModule {}
