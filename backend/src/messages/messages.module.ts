import { Module } from '@nestjs/common'
import { ConversationsModule } from '../conversations/conversations.module'
import { DatabaseModule } from '../database/database.module'
import { MessagesController } from './messages.controller'
import { MessagesRepository } from './messages.repository'
import { MessagesService } from './messages.service'

@Module({
  imports: [DatabaseModule, ConversationsModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository],
})
export class MessagesModule {}
