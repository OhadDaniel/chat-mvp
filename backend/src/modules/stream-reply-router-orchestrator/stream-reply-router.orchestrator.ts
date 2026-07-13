import { Injectable } from '@nestjs/common';
import type { MessageEvent } from '@nestjs/common';
import { from, of, switchMap, type Observable } from 'rxjs';
import { ConversationsService } from '../conversations/conversations.service';
import { StreamAgentReplyOrchestrator } from '../stream-agent-reply-orchestrator/stream-agent-reply.orchestrator';
import type { StoredConversation } from '../conversations/conversations.types';
import type { User } from '../users/users.types';

const SSE_EVENT_ERROR = 'error';
const NOT_REPLYABLE_CODE = 'CONVERSATION_NOT_FOUND';

@Injectable()
export class StreamReplyRouterOrchestrator {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly streamAgentReplyOrchestrator: StreamAgentReplyOrchestrator,
  ) {}

  execute(conversationId: string, user: User): Observable<MessageEvent> {
    return from(
      this.conversationsService.getForParticipant(conversationId, user.id),
    ).pipe(switchMap((conversation) => this.dispatch(conversation, user)));
  }

  private dispatch(
    conversation: StoredConversation,
    user: User,
  ): Observable<MessageEvent> {
    if (conversation.type === 'assistant' || conversation.type === 'tutor') {
      return this.streamAgentReplyOrchestrator.execute(conversation.id, user);
    }
    return of(errorEvent(NOT_REPLYABLE_CODE));
  }
}

function errorEvent(code: string): MessageEvent {
  return { type: SSE_EVENT_ERROR, data: { code } };
}
