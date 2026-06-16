import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import type { PublicUser, User } from '../users/users.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from '../users/dto/update-profile.dto';
import { RequestAvatarUploadDto } from '../users/dto/request-avatar-upload.dto';
import { SetAvatarDto } from '../users/dto/set-avatar.dto';
import { MeOrchestrator } from '../me-orchestrator/me.orchestrator';
import {
  UpdateProfileOrchestrator,
  type UpdateProfileResponse,
} from '../update-profile-orchestrator/update-profile.orchestrator';
import {
  RequestAvatarUploadOrchestrator,
  type RequestAvatarUploadResponse,
} from '../request-avatar-upload-orchestrator/request-avatar-upload.orchestrator';
import {
  SetAvatarOrchestrator,
  type SetAvatarResponse,
} from '../set-avatar-orchestrator/set-avatar.orchestrator';
import {
  RemoveAvatarOrchestrator,
  type RemoveAvatarResponse,
} from '../remove-avatar-orchestrator/remove-avatar.orchestrator';

@UseGuards(JwtAuthGuard)
@Controller('me')
export class ProfileController {
  constructor(
    private readonly meOrchestrator: MeOrchestrator,
    private readonly updateProfileOrchestrator: UpdateProfileOrchestrator,
    private readonly requestAvatarUploadOrchestrator: RequestAvatarUploadOrchestrator,
    private readonly setAvatarOrchestrator: SetAvatarOrchestrator,
    private readonly removeAvatarOrchestrator: RemoveAvatarOrchestrator,
  ) {}

  /** Who am I? FE uses this to restore the session on page refresh. */
  @Get()
  me(@CurrentUser() user: User): { user: PublicUser } {
    return this.meOrchestrator.run(user);
  }

  /** Edit firstName / lastName / email. */
  @Patch()
  updateProfile(
    @CurrentUser() user: User,
    @Body() dto: UpdateProfileDto,
  ): Promise<UpdateProfileResponse> {
    return this.updateProfileOrchestrator.run(user.id, dto);
  }

  /** Hand back a presigned URL the client uploads the avatar bytes to. */
  @Post('avatar/upload-url')
  requestAvatarUpload(
    @CurrentUser() user: User,
    @Body() dto: RequestAvatarUploadDto,
  ): Promise<RequestAvatarUploadResponse> {
    return this.requestAvatarUploadOrchestrator.run(user.id, dto);
  }

  /** Point the profile at an already-uploaded avatar object. */
  @Put('avatar')
  setAvatar(
    @CurrentUser() user: User,
    @Body() dto: SetAvatarDto,
  ): Promise<SetAvatarResponse> {
    return this.setAvatarOrchestrator.run(user.id, dto.key);
  }

  /** Drop the avatar and delete the stored object. */
  @Delete('avatar')
  removeAvatar(@CurrentUser() user: User): Promise<RemoveAvatarResponse> {
    return this.removeAvatarOrchestrator.run(user.id);
  }
}
