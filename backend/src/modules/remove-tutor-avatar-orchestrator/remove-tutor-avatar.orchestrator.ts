import { Injectable } from '@nestjs/common';
import {
  profilesById,
  toConversation,
} from '../conversations/conversations.helpers';
import { ConversationsService } from '../conversations/conversations.service';
import type { PatchConversationResponse } from '../conversations/conversations.types';
import type { User } from '../users/users.types';

@Injectable()
export class RemoveTutorAvatarOrchestrator {
  constructor(private readonly conversationsService: ConversationsService) {}

  async execute(
    conversationId: string,
    user: User,
  ): Promise<PatchConversationResponse> {
    const stored = await this.conversationsService.removeTutorAvatar(
      conversationId,
      user.id,
    );
    return { conversation: toConversation(stored, profilesById([user])) };
  }
}
