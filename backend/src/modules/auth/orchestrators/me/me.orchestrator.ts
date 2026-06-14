import { Injectable } from '@nestjs/common';
import { toPublicUser, type PublicUser, type User } from '../../../users/users.types';

/**
 * GET /me — no cross-service work; the guard already resolved the user.
 * Exists for uniformity so every endpoint goes controller → orchestrator.
 */
@Injectable()
export class MeOrchestrator {
  run(user: User): { user: PublicUser } {
    return { user: toPublicUser(user) };
  }
}
