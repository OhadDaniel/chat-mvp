import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { User } from '../users/users.types';
import type {
  CreateConversationResponse,
  GetConversationsResponse,
  PatchConversationResponse,
} from '../conversations/conversations.types';
import { CreateConversationDto } from '../conversations/dto/create-conversation.request.dto';
import { GetConversationsQueryDto } from '../conversations/dto/get-conversations.query.dto';
import { PatchConversationDto } from '../conversations/dto/patch-conversation.request.dto';
import { RenameGroupDto } from '../conversations/dto/rename-group.request.dto';
import { RenameTutorDto } from '../conversations/dto/rename-tutor.request.dto';
import { RequestGroupAvatarUploadDto } from '../conversations/dto/request-group-avatar-upload.request.dto';
import type { RequestGroupAvatarUploadResponse } from '../conversations/dto/request-group-avatar-upload.response.dto';
import { RequestTutorAvatarUploadDto } from '../conversations/dto/request-tutor-avatar-upload.request.dto';
import type { RequestTutorAvatarUploadResponse } from '../conversations/dto/request-tutor-avatar-upload.response.dto';
import { ListConversationsOrchestrator } from '../list-conversations-orchestrator/list-conversations.orchestrator';
import { CreateConversationRouterOrchestrator } from '../create-conversation-router-orchestrator/create-conversation-router.orchestrator';
import { RenameGroupOrchestrator } from '../rename-group-orchestrator/rename-group.orchestrator';
import { RequestGroupAvatarUploadOrchestrator } from '../request-group-avatar-upload-orchestrator/request-group-avatar-upload.orchestrator';
import { SetGroupAvatarOrchestrator } from '../set-group-avatar-orchestrator/set-group-avatar.orchestrator';
import { RemoveGroupAvatarOrchestrator } from '../remove-group-avatar-orchestrator/remove-group-avatar.orchestrator';
import { RenameTutorOrchestrator } from '../rename-tutor-orchestrator/rename-tutor.orchestrator';
import { RequestTutorAvatarUploadOrchestrator } from '../request-tutor-avatar-upload-orchestrator/request-tutor-avatar-upload.orchestrator';
import { SetTutorAvatarOrchestrator } from '../set-tutor-avatar-orchestrator/set-tutor-avatar.orchestrator';
import { RemoveTutorAvatarOrchestrator } from '../remove-tutor-avatar-orchestrator/remove-tutor-avatar.orchestrator';
import { SetPinnedOrchestrator } from '../set-pinned-orchestrator/set-pinned.orchestrator';


@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(
    private readonly listConversationsOrchestrator: ListConversationsOrchestrator,
    private readonly createConversationRouterOrchestrator: CreateConversationRouterOrchestrator,
    private readonly renameGroupOrchestrator: RenameGroupOrchestrator,
    private readonly requestGroupAvatarUploadOrchestrator: RequestGroupAvatarUploadOrchestrator,
    private readonly setGroupAvatarOrchestrator: SetGroupAvatarOrchestrator,
    private readonly removeGroupAvatarOrchestrator: RemoveGroupAvatarOrchestrator,
    private readonly renameTutorOrchestrator: RenameTutorOrchestrator,
    private readonly requestTutorAvatarUploadOrchestrator: RequestTutorAvatarUploadOrchestrator,
    private readonly setTutorAvatarOrchestrator: SetTutorAvatarOrchestrator,
    private readonly removeTutorAvatarOrchestrator: RemoveTutorAvatarOrchestrator,
    private readonly setPinnedOrchestrator: SetPinnedOrchestrator,
  ) {}

  @Get()
  list(
    @CurrentUser() user: User,
    @Query() query: GetConversationsQueryDto,
  ): Promise<GetConversationsResponse> {
    return this.listConversationsOrchestrator.execute(user.id, query.search);
  }

  @Post()
  create(
    @CurrentUser() user: User,
    @Body() dto: CreateConversationDto,
  ): Promise<CreateConversationResponse> {
    return this.createConversationRouterOrchestrator.execute(user, dto);
  }

  @Patch('groups/:id')
  renameGroup(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: RenameGroupDto,
  ): Promise<PatchConversationResponse> {
    return this.renameGroupOrchestrator.execute(id, user.id, dto);
  }

  @Post('groups/:id/avatar/upload-url')
  requestGroupAvatarUpload(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: RequestGroupAvatarUploadDto,
  ): Promise<RequestGroupAvatarUploadResponse> {
    return this.requestGroupAvatarUploadOrchestrator.execute(id, user.id, dto);
  }

  @Put('groups/:id/avatar')
  setGroupAvatar(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<PatchConversationResponse> {
    return this.setGroupAvatarOrchestrator.execute(id, user.id);
  }

  @Delete('groups/:id/avatar')
  removeGroupAvatar(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<PatchConversationResponse> {
    return this.removeGroupAvatarOrchestrator.execute(id, user.id);
  }

  @Patch('tutors/:id')
  renameTutor(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: RenameTutorDto,
  ): Promise<PatchConversationResponse> {
    return this.renameTutorOrchestrator.execute(id, user, dto);
  }

  @Post('tutors/:id/avatar/upload-url')
  requestTutorAvatarUpload(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: RequestTutorAvatarUploadDto,
  ): Promise<RequestTutorAvatarUploadResponse> {
    return this.requestTutorAvatarUploadOrchestrator.execute(id, user.id, dto);
  }

  @Put('tutors/:id/avatar')
  setTutorAvatar(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<PatchConversationResponse> {
    return this.setTutorAvatarOrchestrator.execute(id, user);
  }

  @Delete('tutors/:id/avatar')
  removeTutorAvatar(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<PatchConversationResponse> {
    return this.removeTutorAvatarOrchestrator.execute(id, user);
  }

  @Patch(':id')
  patch(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: PatchConversationDto,
  ): Promise<PatchConversationResponse> {
    return this.setPinnedOrchestrator.execute(id, user.id, dto);
  }
}
