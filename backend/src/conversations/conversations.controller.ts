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
import type { User } from '../users/entities/user.entity';
import type {
  CreateConversationResponse,
  GetConversationsResponse,
  PatchConversationResponse,
} from './conversations.types';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { GetConversationsQueryDto } from './dto/get-conversations.query.dto';
import { PatchConversationDto } from './dto/patch-conversation.dto';

/**
 * Guard at controller level: every route below — current and future —
 * requires a valid JWT. Impossible to forget on a new endpoint.
 */
@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  list(
    @CurrentUser() user: User,
    @Query() query: GetConversationsQueryDto,
  ): Promise<GetConversationsResponse> {
    return this.conversationsService.list(user.id, query.search);
  }

  @Post()
  create(
    @CurrentUser() user: User,
    @Body() dto: CreateConversationDto,
  ): Promise<CreateConversationResponse> {
    return this.conversationsService.create(user, dto);
  }

  @Patch(':id')
  patch(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: PatchConversationDto,
  ): Promise<PatchConversationResponse> {
    return this.conversationsService.setPinned(id, user.id, dto);
  }
}
