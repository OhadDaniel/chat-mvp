import type { BaseChatModel } from '@langchain/core/language_models/chat_models';

export abstract class ChatModelProvider {
  abstract getChatModel(): BaseChatModel;
}
