import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { UsersService } from '../users/users.service';
import { ConversationsService } from '../conversations/conversations.service';
import {
  mapToPublicUser,
  mapToUserProfile,
  type PublicUser,
} from '../users/users.types';

export type RemoveAvatarResponse = { user: PublicUser };

@Injectable()
export class RemoveAvatarOrchestrator {
  constructor(
    private readonly usersService: UsersService,
    private readonly storage: StorageService,
    private readonly conversationsService: ConversationsService,
  ) {}

  async run(userId: string): Promise<RemoveAvatarResponse> {
    // The JWT guard guarantees the user exists.
    const current = await this.usersService.findById(userId);
    const oldKey = current?.avatar?.storageKey ?? null;

    const updated = await this.usersService.setAvatar(userId, null);

    if (oldKey) {
      await this.storage.deleteObject(oldKey);
    }

    await this.conversationsService.applyParticipantUpdate(
      mapToUserProfile(updated),
    );

    return { user: mapToPublicUser(updated) };
  }
}
