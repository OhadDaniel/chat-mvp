import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import type { LastMessageSnapshot } from '../conversations/conversations.types';
import { TransactionRunner } from '../mongo/transaction.runner';
import type { User } from '../users/users.types';
import { MessagesService } from '../messages/messages.service';
import type { CreateMessageResponse, Message } from '../messages/messages.types';
import type { CreateMessageDto } from '../messages/dto/create-message.request.dto';

@Injectable()
export class CreateMessageOrchestrator {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: MessagesService,
    private readonly transactionRunner: TransactionRunner,
  ) {}

  async run(
    conversationId: string,
    sender: User,
    dto: CreateMessageDto,
  ): Promise<CreateMessageResponse> {
    await this.conversationsService.assertParticipant(conversationId, sender.id);

    return this.transactionRunner.run(async (session) => {
      const message = await this.messagesService.create(
        conversationId,
        sender,
        dto,
        session,
      );
      await this.conversationsService.updateLastMessage(
        conversationId,
        mapMessageToSnapshot(message),
        session,
      );
      return { message };
    });
  }
}

function mapMessageToSnapshot(message: Message): LastMessageSnapshot {
  return {
    content: message.content,
    senderId: message.sender.id,
    sentAt: new Date(message.sentAt),
  };
}
