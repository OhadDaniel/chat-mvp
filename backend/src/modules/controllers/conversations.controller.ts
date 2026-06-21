import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
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
import { ListConversationsOrchestrator } from '../list-conversations-orchestrator/list-conversations.orchestrator';
import { CreateConversationOrchestrator } from '../create-conversation-orchestrator/create-conversation.orchestrator';
import { SetPinnedOrchestrator } from '../set-pinned-orchestrator/set-pinned.orchestrator';


@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(
    private readonly listConversationsOrchestrator: ListConversationsOrchestrator,
    private readonly createConversationOrchestrator: CreateConversationOrchestrator,
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
    return this.createConversationOrchestrator.execute(user, dto);
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
