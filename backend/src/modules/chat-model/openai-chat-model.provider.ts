import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { DEFAULT_CHAT_MODEL } from './chat-model.constants';
import { ChatModelProvider } from './chat-model-provider';
import { ChatModelUnavailableError } from './errors/chat-model-unavailable.error';

@Injectable()
export class OpenAiChatModelProvider extends ChatModelProvider {
  private readonly apiKey: string | undefined;
  private readonly model: string;
  private chatModel: BaseChatModel | undefined;

  constructor(configService: ConfigService) {
    super();
    this.apiKey = configService.get<string>('OPENAI_API_KEY');
    this.model =
      configService.get<string>('OPENAI_MODEL') ?? DEFAULT_CHAT_MODEL;
  }

  getChatModel(): BaseChatModel {
    if (!this.apiKey) {
      throw new ChatModelUnavailableError();
    }
    if (!this.chatModel) {
      this.chatModel = new ChatOpenAI({
        apiKey: this.apiKey,
        model: this.model,
      });
    }
    return this.chatModel;
  }
}
