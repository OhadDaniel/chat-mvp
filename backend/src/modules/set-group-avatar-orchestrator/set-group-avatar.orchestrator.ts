import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { UsersService } from '../users/users.service';
import { StorageService } from '../storage/storage.service';
import { buildGroupAvatarKey } from '../storage/storage.helpers';
import {
  profilesById,
  toConversation,
} from '../conversations/conversations.helpers';
import type { PatchConversationResponse } from '../conversations/conversations.types';

@Injectable()
export class SetGroupAvatarOrchestrator {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly usersService: UsersService,
    private readonly storage: StorageService,
  ) {}

  async execute(
    conversationId: string,
    userId: string,
  ): Promise<PatchConversationResponse> {
    // The key is derived from the conversation, not sent by the client, and the
    // upload overwrote it in place — so there's nothing to validate or delete.
    const key = buildGroupAvatarKey(conversationId);
    const avatar = { storageKey: key, srcUrl: this.storage.srcUrlFor(key) };
    const stored = await this.conversationsService.setGroupAvatar(
      conversationId,
      userId,
      avatar,
    );
    const profiles = profilesById(
      await this.usersService.findByIds(stored.participantIds),
    );
    return { conversation: toConversation(stored, profiles) };
  }
}
