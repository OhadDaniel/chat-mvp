import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { User } from '../users/users.types';
import { CreateMessageDto } from '../messages/dto/create-message.request.dto';
import { GetMessagesQueryDto } from '../messages/dto/get-messages.query.dto';
import type {
  CreateMessageResponse,
  GetMessagesResponse,
} from '../messages/messages.types';
import { GetMessagesOrchestrator } from '../get-messages-orchestrator/get-messages.orchestrator';
import { CreateMessageOrchestrator } from '../create-message-orchestrator/create-message.orchestrator';

@UseGuards(JwtAuthGuard)
@Controller('conversations/:conversationId/messages')
export class MessagesController {
  constructor(
    private readonly getMessagesOrchestrator: GetMessagesOrchestrator,
    private readonly createMessageOrchestrator: CreateMessageOrchestrator,
  ) {}

  @Get()
  getPage(
    @CurrentUser() user: User,
    @Param('conversationId') conversationId: string,
    @Query() query: GetMessagesQueryDto,
  ): Promise<GetMessagesResponse> {
    return this.getMessagesOrchestrator.run(conversationId, user.id, query);
  }

  @Post()
  create(
    @CurrentUser() user: User,
    @Param('conversationId') conversationId: string,
    @Body() dto: CreateMessageDto,
  ): Promise<CreateMessageResponse> {
    return this.createMessageOrchestrator.run(conversationId, user, dto);
  }
}
