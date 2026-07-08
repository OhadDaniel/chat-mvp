import { Controller, Param, Sse, UseGuards } from '@nestjs/common';
import type { MessageEvent } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { User } from '../users/users.types';
import { StreamAssistantReplyOrchestrator } from '../stream-assistant-reply-orchestrator/stream-assistant-reply.orchestrator';

@UseGuards(JwtAuthGuard)
@Controller('conversations/:conversationId/assistant')
export class AssistantController {
  constructor(
    private readonly streamAssistantReplyOrchestrator: StreamAssistantReplyOrchestrator,
  ) {}

  @Sse()
  stream(
    @CurrentUser() user: User,
    @Param('conversationId') conversationId: string,
  ): Observable<MessageEvent> {
    return this.streamAssistantReplyOrchestrator.execute(conversationId, user);
  }
}
