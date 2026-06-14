import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../../conversations.service';
import type { PatchConversationResponse } from '../../conversations.types';
import type { PatchConversationDto } from '../../dto/patch-conversation.dto';

/** PATCH /conversations/:id — pin/unpin; authz is the service's pair gate. */
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
