import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { MessagesRepository } from './messages.repository';
import { MessagesService } from './messages.service';

/**
 * Single-entity service module: the messages domain only. No controller
 * and no ConversationsService — the 403 authz gate is composed in front
 * of this service by the message orchestrators.
 */
@Module({
  imports: [DatabaseModule],
  providers: [MessagesService, MessagesRepository],
  exports: [MessagesService],
})
export class MessagesModule {}
