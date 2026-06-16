import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { MessagesModule } from '../messages/messages.module';
import { GetMessagesOrchestrator } from './get-messages.orchestrator';

@Module({
  imports: [ConversationsModule, MessagesModule],
  providers: [GetMessagesOrchestrator],
  exports: [GetMessagesOrchestrator],
})
export class GetMessagesModule {}
