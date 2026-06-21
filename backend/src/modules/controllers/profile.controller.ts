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
import { UpdateProfileDto } from '../users/dto/update-profile.request.dto';
import { RequestAvatarUploadDto } from '../users/dto/request-avatar-upload.request.dto';
import { MeOrchestrator } from '../me-orchestrator/me.orchestrator';
import { UpdateProfileOrchestrator } from '../update-profile-orchestrator/update-profile.orchestrator';
import { RequestAvatarUploadOrchestrator } from '../request-avatar-upload-orchestrator/request-avatar-upload.orchestrator';
import { SetAvatarOrchestrator } from '../set-avatar-orchestrator/set-avatar.orchestrator';
import { RemoveAvatarOrchestrator } from '../remove-avatar-orchestrator/remove-avatar.orchestrator';
import type { UpdateProfileResponse } from '../users/dto/update-profile.response.dto';
import type { RequestAvatarUploadResponse } from '../users/dto/request-avatar-upload.response.dto';
import type { SetAvatarResponse } from '../users/dto/set-avatar.response.dto';
import type { RemoveAvatarResponse } from '../users/dto/remove-avatar.response.dto';

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
    return this.meOrchestrator.execute(user);
  }

  /** Edit firstName / lastName / email. */
  @Patch()
  updateProfile(
    @CurrentUser() user: User,
    @Body() dto: UpdateProfileDto,
  ): Promise<UpdateProfileResponse> {
    return this.updateProfileOrchestrator.execute(user.id, dto);
  }

  /** Hand back a presigned URL the client uploads the avatar bytes to. */
  @Post('avatar/upload-url')
  requestAvatarUpload(
    @CurrentUser() user: User,
    @Body() dto: RequestAvatarUploadDto,
  ): Promise<RequestAvatarUploadResponse> {
    return this.requestAvatarUploadOrchestrator.execute(user.id, dto);
  }

  /** Claim the just-uploaded avatar: the key is derived from the user, not sent. */
  @Put('avatar')
  setAvatar(@CurrentUser() user: User): Promise<SetAvatarResponse> {
    return this.setAvatarOrchestrator.execute(user.id);
  }

  /** Drop the avatar from the profile. */
  @Delete('avatar')
  removeAvatar(@CurrentUser() user: User): Promise<RemoveAvatarResponse> {
    return this.removeAvatarOrchestrator.execute(user.id);
  }
}
