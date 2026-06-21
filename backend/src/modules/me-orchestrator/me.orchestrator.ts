import { Injectable } from '@nestjs/common';
import type { PublicUser, User } from '../users/users.types';
import { mapToPublicUser } from '../users/users.mappers';

@Injectable()
export class MeOrchestrator {
  execute(user: User): { user: PublicUser } {
    return { user: mapToPublicUser(user) };
  }
}
