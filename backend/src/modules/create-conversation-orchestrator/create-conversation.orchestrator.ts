import { Injectable } from '@nestjs/common';
import { AppException } from '../../common/errors/app.exception';
import type { User } from '../users/users.types';
import { UsersService } from '../users/users.service';
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

  async run(
    currentUser: User,
    dto: CreateConversationDto,
  ): Promise<CreateConversationResponse> {
    const participant = await this.usersService.findById(dto.participantId);
    if (!participant) {
      throw new AppException(404, 'USER_NOT_FOUND', 'Participant not found');
    }

    const stored = await this.conversationsService.create(
      currentUser.id,
      participant.id,
    );
    const profiles = profilesById([currentUser, participant]);
    return { conversation: toConversation(stored, profiles) };
  }
}
