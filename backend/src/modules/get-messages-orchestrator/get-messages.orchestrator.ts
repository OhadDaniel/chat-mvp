import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { MessagesService } from '../messages/messages.service';
import type { GetMessagesResponse } from '../messages/messages.types';
import type { GetMessagesQueryDto } from '../messages/dto/get-messages.query.dto';


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
