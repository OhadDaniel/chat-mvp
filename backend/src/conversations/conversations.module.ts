import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { UsersModule } from '../users/users.module'
import { ConversationsController } from './conversations.controller'
import { ConversationsRepository } from './conversations.repository'
import { ConversationsService } from './conversations.service'

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [ConversationsController],
  providers: [ConversationsService, ConversationsRepository],
  exports: [ConversationsService], // MessagesModule needs the 403 rule; the repo stays private
})
export class ConversationsModule {}
