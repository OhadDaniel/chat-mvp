import { Body, Controller, Param, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { User } from '../users/users.types';
import { CreateMessageDto } from '../messages/dto/create-message.request.dto';
import { StreamAssistantReplyOrchestrator } from '../stream-assistant-reply-orchestrator/stream-assistant-reply.orchestrator';
import { SseWriter } from '../stream-assistant-reply-orchestrator/sse-writer';

@UseGuards(JwtAuthGuard)
@Controller('conversations/:conversationId/assistant')
export class AssistantController {
  constructor(
    private readonly streamAssistantReplyOrchestrator: StreamAssistantReplyOrchestrator,
  ) {}

  @Post()
  stream(
    @CurrentUser() user: User,
    @Param('conversationId') conversationId: string,
    @Body() dto: CreateMessageDto,
    @Res() res: Response,): Promise<void> {
    return this.streamAssistantReplyOrchestrator.execute(
      conversationId,
      user,
      dto,
      new SseWriter(res),
    );
  }
}
