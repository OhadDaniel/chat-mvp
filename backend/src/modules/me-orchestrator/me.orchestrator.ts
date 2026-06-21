import { Injectable } from '@nestjs/common';
import { mapToPublicUser, type PublicUser, type User } from '../users/users.types';

@Injectable()
export class MeOrchestrator {
  execute(user: User): { user: PublicUser } {
    return { user: mapToPublicUser(user) };
  }
}
