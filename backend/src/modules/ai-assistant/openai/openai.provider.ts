import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_OPENAI_MODEL } from '../ai-assistant.constants';
import { AssistantUnavailableError } from '../errors/assistant-unavailable.error';
import { LlmProvider } from '../llm-abstraction/llm-provider';
import { toOpenAiMessages, toOpenAiTools } from './openai.mappers';
import { streamOpenAiChunks } from './openai.stream';
import type {
  ProviderRequest,
  ProviderStreamEvent,
} from '../llm-abstraction/llm.types';

@Injectable()
export class OpenAIProvider extends LlmProvider {
  private readonly apiKey: string | undefined;
  private readonly model: string;
  private client: OpenAI | undefined;

  constructor(configService: ConfigService) {
    super();
    this.apiKey = configService.get<string>('OPENAI_API_KEY');
    this.model =
      configService.get<string>('OPENAI_MODEL') ?? DEFAULT_OPENAI_MODEL;
  }

  async *streamMessage(
    request: ProviderRequest,
  ): AsyncIterable<ProviderStreamEvent> {
    const stream = await this.getClient().chat.completions.create({
      model: this.model,
      stream: true,
      messages: toOpenAiMessages(request),
      tools: toOpenAiTools(request.tools),
    });

    yield* streamOpenAiChunks(stream);
  }

  private getClient(): OpenAI {
    if (!this.apiKey) {
      throw new AssistantUnavailableError();
    }
    if (!this.client) {
      this.client = new OpenAI({ apiKey: this.apiKey });
    }
    return this.client;
  }
}
