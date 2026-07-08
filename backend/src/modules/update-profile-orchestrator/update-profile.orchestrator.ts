import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { mapToPublicUser } from '../users/users.mappers';
import type { UpdateProfileDto } from '../users/dto/update-profile.request.dto';
import type { UpdateProfileResponse } from '../users/dto/update-profile.response.dto';

@Injectable()
export class UpdateProfileOrchestrator {
  constructor(private readonly usersService: UsersService) {}

  async execute(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<UpdateProfileResponse> {
    const updated = await this.usersService.updateProfile(userId, dto);
    return { user: mapToPublicUser(updated) };
  }
}
