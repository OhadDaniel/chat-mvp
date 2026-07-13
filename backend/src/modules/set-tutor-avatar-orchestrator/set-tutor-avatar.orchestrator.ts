import { Injectable } from '@nestjs/common';
import {
  profilesById,
  toConversation,
} from '../conversations/conversations.helpers';
import { ConversationsService } from '../conversations/conversations.service';
import { StorageService } from '../storage/storage.service';
import { buildTutorAvatarKey } from '../storage/storage.helpers';
import type { PatchConversationResponse } from '../conversations/conversations.types';
import type { User } from '../users/users.types';

@Injectable()
export class SetTutorAvatarOrchestrator {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly storage: StorageService,
  ) {}

  async execute(
    conversationId: string,
    user: User,
  ): Promise<PatchConversationResponse> {
    const key = buildTutorAvatarKey(conversationId);
    const avatar = { storageKey: key, srcUrl: this.storage.srcUrlFor(key) };
    const stored = await this.conversationsService.setTutorAvatar(
      conversationId,
      user.id,
      avatar,
    );
    return { conversation: toConversation(stored, profilesById([user])) };
  }
}
