import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { UsersService } from '../users/users.service';
import {
  profilesById,
  toConversation,
} from '../conversations/conversations.helpers';
import type {
  Conversation,
  GetConversationsResponse,
} from '../conversations/conversations.types';

@Injectable()
export class ListConversationsOrchestrator {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly usersService: UsersService,
  ) {}

  async run(userId: string, search?: string): Promise<GetConversationsResponse> {
    const stored = await this.conversationsService.list(userId);
    const ids = [...new Set(stored.flatMap((c) => c.participantIds))];
    const profiles = profilesById(await this.usersService.findByIds(ids));
    const conversations = stored.map((c) => toConversation(c, profiles));
    return { conversations: filterBySearch(conversations, search) };
  }
}

function filterBySearch(
  conversations: Conversation[],
  search?: string,
): Conversation[] {
  const term = search?.trim().toLowerCase();
  if (!term) {
    return conversations;
  }
  return conversations.filter((conversation) =>
    conversation.participants.some((participant) =>
      participant.name.toLowerCase().includes(term),
    ),
  );
}
