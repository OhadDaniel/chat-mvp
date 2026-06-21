import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { MessagesService } from '../messages/messages.service';
import { UsersService } from '../users/users.service';
import { mapToUserProfile } from '../users/users.types';
import type { GetMessagesResponse } from '../messages/messages.types';
import type { GetMessagesQueryDto } from '../messages/dto/get-messages.query.dto';

@Injectable()
export class GetMessagesOrchestrator {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
  ) {}

  async execute(
    conversationId: string,
    userId: string,
    query: GetMessagesQueryDto,
  ): Promise<GetMessagesResponse> {
    const conversation = await this.conversationsService.getForParticipant(
      conversationId,
      userId,
    );
    const participants = (
      await this.usersService.findByIds(conversation.participantIds)
    ).map(mapToUserProfile);
    const page = await this.messagesService.getPage(
      conversationId,
      query,
      participants,
    );
    return { messages: page.items, nextCursor: page.nextCursor };
  }
}
