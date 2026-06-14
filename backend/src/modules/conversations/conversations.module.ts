import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ConversationsRepository } from './conversations.repository';
import { ConversationsService } from './conversations.service';

/**
 * Single-entity service module: the conversations domain only. No
 * controller (endpoints are wired by orchestrators) and no other
 * entity's service — UsersService coupling moved up to the
 * create-conversation orchestrator.
 */
@Module({
  imports: [DatabaseModule],
  providers: [ConversationsService, ConversationsRepository],
  exports: [ConversationsService], // orchestrators (incl. messages') compose it
})
export class ConversationsModule {}
