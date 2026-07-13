import { Injectable } from '@nestjs/common';
import {
  profilesById,
  toConversation,
} from '../conversations/conversations.helpers';
import { ConversationsService } from '../conversations/conversations.service';
import type { CreateConversationResponse } from '../conversations/conversations.types';
import type { User } from '../users/users.types';

@Injectable()
export class CreateTutorConversationOrchestrator {
  constructor(private readonly conversationsService: ConversationsService) {}

  async execute(
    currentUser: User,
    name: string,
  ): Promise<CreateConversationResponse> {
    const stored = await this.conversationsService.createTutor(
      currentUser.id,
      name,
    );
    const profiles = profilesById([currentUser]);
    return { conversation: toConversation(stored, profiles) };
  }
}
