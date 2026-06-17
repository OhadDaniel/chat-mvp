import { Injectable } from '@nestjs/common';
import { AppException } from '../../common/errors/app.exception';
import { StorageService } from '../storage/storage.service';
import { isOwnedAvatarKey } from '../storage/storage.helpers';
import { UsersService } from '../users/users.service';
import { ConversationsService } from '../conversations/conversations.service';
import {
  mapToPublicUser,
  mapToUserProfile,
  type Avatar,
  type PublicUser,
} from '../users/users.types';

export type SetAvatarResponse = { user: PublicUser };

@Injectable()
export class SetAvatarOrchestrator {
  constructor(
    private readonly usersService: UsersService,
    private readonly storage: StorageService,
    private readonly conversationsService: ConversationsService,
  ) {}

  async run(userId: string, key: string): Promise<SetAvatarResponse> {
    if (!isOwnedAvatarKey(userId, key)) {
      throw new AppException(
        400,
        'INVALID_AVATAR_KEY',
        'Avatar key does not belong to this user',
      );
    }

    // The JWT guard guarantees the user exists.
    const current = await this.usersService.findById(userId);
    const oldKey = current?.avatar?.storageKey ?? null;

    const avatar: Avatar = {
      storageKey: key,
      srcUrl: this.storage.srcUrlFor(key),
    };
    const updated = await this.usersService.setAvatar(userId, avatar);

    if (oldKey && oldKey !== key) {
      await this.storage.deleteObject(oldKey);
    }

    await this.conversationsService.applyParticipantUpdate(
      mapToUserProfile(updated),
    );

    return { user: mapToPublicUser(updated) };
  }
}
