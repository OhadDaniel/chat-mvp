import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import {
  mapToPublicUser,
  type PublicUser,
  type User,
} from '../users/users.types';

@Injectable()
export class MeOrchestrator {
  constructor(private readonly storage: StorageService) {}

  run(user: User): { user: PublicUser } {
    return {
      user: mapToPublicUser(user, this.storage.publicUrl(user.avatarKey)),
    };
  }
}
