import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import type { PatchConversationResponse } from '../conversations/conversations.types';
import type { PatchConversationDto } from '../conversations/dto/patch-conversation.dto';


@Injectable()
export class SetPinnedOrchestrator {
  constructor(private readonly conversationsService: ConversationsService) {}

  run(
    conversationId: string,
    userId: string,
    dto: PatchConversationDto,
  ): Promise<PatchConversationResponse> {
    return this.conversationsService.setPinned(conversationId, userId, dto);
  }
}
