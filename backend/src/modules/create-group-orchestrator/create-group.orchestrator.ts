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
import type { CreateGroupDto } from '../conversations/dto/create-group.request.dto';

@Injectable()
export class CreateGroupOrchestrator {
  constructor(
    private readonly usersService: UsersService,
    private readonly conversationsService: ConversationsService,
  ) {}

  async execute(
    currentUser: User,
    dto: CreateGroupDto,
  ): Promise<CreateConversationResponse> {
    const others = await this.usersService.findByIds(dto.participantIds);
    // findByIds only returns the ids that exist; a short count means one was bogus.
    if (others.length !== dto.participantIds.length) {
      throw new UserNotFoundError('One or more participants not found');
    }

    const stored = await this.conversationsService.createGroup(
      currentUser.id,
      dto.name,
      dto.participantIds,
    );
    const profiles = profilesById([currentUser, ...others]);
    return { conversation: toConversation(stored, profiles) };
  }
}
