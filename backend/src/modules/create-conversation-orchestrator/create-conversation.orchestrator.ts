import { Injectable } from '@nestjs/common';
import type { User } from '../users/users.types';
import { UsersService } from '../users/users.service';
import { UserNotFoundError } from '../users/errors/user-not-found.error';
import { ConversationsService } from '../conversations/conversations.service';
import {
  profilesById,
  toConversation,
} from '../conversations/conversations.helpers';
import type { CreateConversationResponse } from '../conversations/conversations.types';
import type { CreateConversationDto } from '../conversations/dto/create-conversation.request.dto';

@Injectable()
export class CreateConversationOrchestrator {
  constructor(
    private readonly usersService: UsersService,
    private readonly conversationsService: ConversationsService,
  ) {}

  async execute(
    currentUser: User,
    dto: CreateConversationDto,
  ): Promise<CreateConversationResponse> {
    const participant = await this.usersService.findById(dto.participantId);
    if (!participant) {
      throw new UserNotFoundError('Participant not found');
    }

    const stored = await this.conversationsService.create(
      currentUser.id,
      participant.id,
    );
    const profiles = profilesById([currentUser, participant]);
    return { conversation: toConversation(stored, profiles) };
  }
}
