import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { MessagesModule } from '../messages/messages.module';
import { UsersModule } from '../users/users.module';
import { GetMessagesOrchestrator } from './get-messages.orchestrator';

@Module({
  imports: [ConversationsModule, MessagesModule, UsersModule],
  providers: [GetMessagesOrchestrator],
  exports: [GetMessagesOrchestrator],
})
export class GetMessagesModule {}
