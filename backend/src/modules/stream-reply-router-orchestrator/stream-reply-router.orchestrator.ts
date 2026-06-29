import { Injectable } from '@nestjs/common';
import type { MessageEvent } from '@nestjs/common';
import { from, of, switchMap, type Observable } from 'rxjs';
import { ConversationsService } from '../conversations/conversations.service';
import { StreamAssistantReplyOrchestrator } from '../stream-assistant-reply-orchestrator/stream-assistant-reply.orchestrator';
import { StreamTutorReplyOrchestrator } from '../stream-tutor-reply-orchestrator/stream-tutor-reply.orchestrator';
import type { StoredConversation } from '../conversations/conversations.types';
import type { User } from '../users/users.types';

const SSE_EVENT_ERROR = 'error';
const NOT_REPLYABLE_CODE = 'CONVERSATION_NOT_FOUND';

@Injectable()
export class StreamReplyRouterOrchestrator {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly streamAssistantReplyOrchestrator: StreamAssistantReplyOrchestrator,
    private readonly streamTutorReplyOrchestrator: StreamTutorReplyOrchestrator,
  ) {}

  execute(conversationId: string, user: User): Observable<MessageEvent> {
    return from(
      this.conversationsService.getForParticipant(conversationId, user.id),
    ).pipe(
      switchMap((conversation) => this.dispatch(conversation, user)),
    );
  }

  private dispatch(
    conversation: StoredConversation,
    user: User,
  ): Observable<MessageEvent> {
    if (conversation.type === 'assistant') {
      return this.streamAssistantReplyOrchestrator.execute(
        conversation.id,
        user,
      );
    }
    if (conversation.type === 'tutor') {
      return this.streamTutorReplyOrchestrator.execute(conversation.id, user);
    }
    return of(errorEvent(NOT_REPLYABLE_CODE));
  }
}

function errorEvent(code: string): MessageEvent {
  return { type: SSE_EVENT_ERROR, data: { code } };
}
