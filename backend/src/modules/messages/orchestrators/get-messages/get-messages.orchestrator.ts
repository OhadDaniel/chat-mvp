import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../../../conversations/conversations.service';
import { MessagesService } from '../../messages.service';
import type { GetMessagesResponse } from '../../messages.types';
import type { GetMessagesQueryDto } from '../../dto/get-messages.query.dto';

/**
 * GET /conversations/:id/messages — authorize via the conversations 403
 * rule (404 if missing, 403 if not a participant) BEFORE reading any
 * messages, then page.
 */
@Injectable()
export class GetMessagesOrchestrator {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: MessagesService,
  ) {}

  async run(
    conversationId: string,
    userId: string,
    query: GetMessagesQueryDto,
  ): Promise<GetMessagesResponse> {
    await this.conversationsService.getForParticipant(conversationId, userId);
    return this.messagesService.getPage(conversationId, query);
  }
}
