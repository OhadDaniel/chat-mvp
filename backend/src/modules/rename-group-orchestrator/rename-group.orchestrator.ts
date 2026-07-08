import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { UsersService } from '../users/users.service';
import {
  profilesById,
  toConversation,
} from '../conversations/conversations.helpers';
import type { PatchConversationResponse } from '../conversations/conversations.types';
import type { RenameGroupDto } from '../conversations/dto/rename-group.request.dto';

@Injectable()
export class RenameGroupOrchestrator {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly usersService: UsersService,
  ) {}

  async execute(
    conversationId: string,
    userId: string,
    dto: RenameGroupDto,
  ): Promise<PatchConversationResponse> {
    const stored = await this.conversationsService.renameGroup(
      conversationId,
      userId,
      dto.name,
    );
    const profiles = profilesById(
      await this.usersService.findByIds(stored.participantIds),
    );
    return { conversation: toConversation(stored, profiles) };
  }
}
