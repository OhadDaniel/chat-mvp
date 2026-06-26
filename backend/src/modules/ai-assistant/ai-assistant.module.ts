import { Module } from '@nestjs/common';
import { LlmProvider } from './llm-abstraction/llm-provider';
import { OpenAIProvider } from './openai/openai.provider';

@Module({
  providers: [{ provide: LlmProvider, useClass: OpenAIProvider }],
  exports: [LlmProvider],
})
export class AssistantModule {}
