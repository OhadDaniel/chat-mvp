import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { UsersService } from '../users/users.service';
import {
  profilesById,
  toConversation,
} from '../conversations/conversations.helpers';
import type { PatchConversationResponse } from '../conversations/conversations.types';
import type { PatchConversationDto } from '../conversations/dto/patch-conversation.dto';

@Injectable()
export class SetPinnedOrchestrator {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly usersService: UsersService,
  ) {}

  async run(
    conversationId: string,
    userId: string,
    dto: PatchConversationDto,
  ): Promise<PatchConversationResponse> {
    const stored = await this.conversationsService.setPinned(
      conversationId,
      userId,
      dto,
    );
    const profiles = profilesById(
      await this.usersService.findByIds(stored.participantIds),
    );
    return { conversation: toConversation(stored, profiles) };
  }
}
