import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { MessagesModule } from '../messages/messages.module';
import { MongoModule } from '../mongo/mongo.module';
import { CreateMessageOrchestrator } from './create-message.orchestrator';

@Module({
  imports: [ConversationsModule, MessagesModule, MongoModule],
  providers: [CreateMessageOrchestrator],
  exports: [CreateMessageOrchestrator],
})
export class CreateMessageModule {}
