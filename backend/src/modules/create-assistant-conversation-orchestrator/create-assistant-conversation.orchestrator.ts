import { Injectable } from '@nestjs/common';
import type { User } from '../users/users.types';
import { ConversationsService } from '../conversations/conversations.service';
import {
  profilesById,
  toConversation,
} from '../conversations/conversations.helpers';
import type { CreateConversationResponse } from '../conversations/conversations.types';

@Injectable()
export class CreateAssistantConversationOrchestrator {
  constructor(private readonly conversationsService: ConversationsService) {}

  async execute(currentUser: User): Promise<CreateConversationResponse> {
    const stored = await this.conversationsService.createAssistant(
      currentUser.id,
    );
    const profiles = profilesById([currentUser]);
    return { conversation: toConversation(stored, profiles) };
  }
}
