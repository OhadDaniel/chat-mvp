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

@Injectable()
export class CreateGroupOrchestrator {
  constructor(
    private readonly usersService: UsersService,
    private readonly conversationsService: ConversationsService,
  ) {}

  async execute(
    currentUser: User,
    name: string,
    participantIds: string[],
  ): Promise<CreateConversationResponse> {
    const others = await this.usersService.findByIds(participantIds);
    if (others.length !== participantIds.length) {
      throw new UserNotFoundError('One or more participants not found');
    }

    const stored = await this.conversationsService.createGroup(
      currentUser.id,
      name,
      participantIds,
    );
    const profiles = profilesById([currentUser, ...others]);
    return { conversation: toConversation(stored, profiles) };
  }
}
