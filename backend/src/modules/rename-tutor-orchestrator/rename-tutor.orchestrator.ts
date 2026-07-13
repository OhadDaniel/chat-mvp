import { Injectable } from '@nestjs/common';
import {
  profilesById,
  toConversation,
} from '../conversations/conversations.helpers';
import { ConversationsService } from '../conversations/conversations.service';
import type { PatchConversationResponse } from '../conversations/conversations.types';
import type { RenameTutorDto } from '../conversations/dto/rename-tutor.request.dto';
import type { User } from '../users/users.types';

@Injectable()
export class RenameTutorOrchestrator {
  constructor(private readonly conversationsService: ConversationsService) {}

  async execute(
    conversationId: string,
    user: User,
    dto: RenameTutorDto,
  ): Promise<PatchConversationResponse> {
    const stored = await this.conversationsService.renameTutor(
      conversationId,
      user.id,
      dto.name,
    );
    return { conversation: toConversation(stored, profilesById([user])) };
  }
}
