import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../../../conversations/conversations.service';
import type { User } from '../../../users/users.types';
import { MessagesService } from '../../messages.service';
import type { CreateMessageResponse } from '../../messages.types';
import type { CreateMessageDto } from '../../dto/create-message.dto';

/**
 * POST /conversations/:id/messages — same gate as reads (403/404), then
 * write. The sender is reduced to a public profile inside MessagesService.
 */
@Injectable()
export class CreateMessageOrchestrator {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: MessagesService,
  ) {}

  async run(
    conversationId: string,
    sender: User,
    dto: CreateMessageDto,
  ): Promise<CreateMessageResponse> {
    await this.conversationsService.getForParticipant(
      conversationId,
      sender.id,
    );
    return this.messagesService.create(conversationId, sender, dto);
  }
}
