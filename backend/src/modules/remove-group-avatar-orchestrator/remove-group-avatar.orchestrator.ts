import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { UsersService } from '../users/users.service';
import {
  profilesById,
  toConversation,
} from '../conversations/conversations.helpers';
import type { PatchConversationResponse } from '../conversations/conversations.types';

@Injectable()
export class RemoveGroupAvatarOrchestrator {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly usersService: UsersService,
  ) {}

  async execute(
    conversationId: string,
    userId: string,
  ): Promise<PatchConversationResponse> {
    const stored = await this.conversationsService.removeGroupAvatar(
      conversationId,
      userId,
    );
    const profiles = profilesById(
      await this.usersService.findByIds(stored.participantIds),
    );
    return { conversation: toConversation(stored, profiles) };
  }
}
