import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ConversationsService } from '../conversations/conversations.service';
import {
  mapToPublicUser,
  mapToUserProfile,
  type PublicUser,
} from '../users/users.types';
import type { UpdateProfileDto } from '../users/dto/update-profile.dto';

export type UpdateProfileResponse = { user: PublicUser };

@Injectable()
export class UpdateProfileOrchestrator {
  constructor(
    private readonly usersService: UsersService,
    private readonly conversationsService: ConversationsService,
  ) {}

  async run(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<UpdateProfileResponse> {
    const updated = await this.usersService.updateProfile(userId, dto);
    await this.conversationsService.applyParticipantUpdate(
      mapToUserProfile(updated),
    );
    return { user: mapToPublicUser(updated) };
  }
}
