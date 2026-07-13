import { Module } from '@nestjs/common';
import { ChatModelProvider } from './chat-model-provider';
import { OpenAiChatModelProvider } from './openai-chat-model.provider';

@Module({
  providers: [
    { provide: ChatModelProvider, useClass: OpenAiChatModelProvider },
  ],
  exports: [ChatModelProvider],
})
export class ChatModelModule {}
