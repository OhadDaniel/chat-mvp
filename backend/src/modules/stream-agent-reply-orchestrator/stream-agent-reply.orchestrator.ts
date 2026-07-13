import { Injectable, Logger } from '@nestjs/common';
import type { MessageEvent } from '@nestjs/common';
import { HumanMessage } from '@langchain/core/messages';
import { from, type Observable } from 'rxjs';
import { ConversationsService } from '../conversations/conversations.service';
import { MessagesService } from '../messages/messages.service';
import { TransactionRunner } from '../mongo/transaction.runner';
import { AgentGraph } from '../agent/agent.graph';
import { latestQuestion } from './latest-question';
import {
  deltaEvent,
  doneEvent,
  errorEvent,
  readCitations,
  readCustomToken,
  readUpdateEvents,
} from './stream-agent-reply.mappers';
import {
  AGENT_STREAM_FAILED_CODE,
  AGENT_STREAM_MODES,
  NO_QUESTION_CODE,
  NOT_REPLYABLE_CODE,
  RECENT_MESSAGES_LIMIT,
} from './stream-agent-reply.constants';
import type { AgentMode } from '../agent/agent.types';
import type { User } from '../users/users.types';
import type { Citation, Message } from '../messages/messages.types';
import type {
  LastMessageSnapshot,
  StoredConversation,
} from '../conversations/conversations.types';

@Injectable()
export class StreamAgentReplyOrchestrator {
  private readonly logger = new Logger(StreamAgentReplyOrchestrator.name);

  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: MessagesService,
    private readonly transactionRunner: TransactionRunner,
    private readonly agentGraph: AgentGraph,
  ) {}

  execute(conversationId: string, user: User): Observable<MessageEvent> {
    return from(this.run(conversationId, user));
  }

  private async *run(
    conversationId: string,
    user: User,
  ): AsyncGenerator<MessageEvent> {
    const conversation = await this.conversationsService.getForParticipant(
      conversationId,
      user.id,
    );
    const mode = toMode(conversation.type);
    if (mode === undefined) {
      yield errorEvent(NOT_REPLYABLE_CODE);
      return;
    }

    const recent = await this.messagesService.loadRecent(
      conversationId,
      RECENT_MESSAGES_LIMIT,
    );
    const question = latestQuestion(recent);
    if (question === undefined) {
      yield errorEvent(NO_QUESTION_CODE);
      return;
    }

    try {
      const graph = this.agentGraph.getGraph();
      const stream = await graph.stream(
        { messages: [new HumanMessage(question)] },
        {
          configurable: {
            thread_id: conversationId,
            userId: user.id,
            conversationId,
            mode,
          },
          streamMode: AGENT_STREAM_MODES,
        },
      );

      let answer = '';
      for await (const chunk of stream) {
        const frame: unknown = chunk;
        const token = readCustomToken(frame);
        if (token !== undefined) {
          answer += token;
          yield deltaEvent(token);
          continue;
        }
        for (const event of readUpdateEvents(frame)) {
          yield event;
        }
      }

      const snapshot = await graph.getState({
        configurable: { thread_id: conversationId },
      });
      const citations = readCitations(snapshot.values);
      const reply = await this.saveReply(conversationId, answer, citations);
      yield doneEvent(reply.id, citations);
    } catch (error) {
      this.logger.error('Agent reply stream failed', error);
      yield errorEvent(AGENT_STREAM_FAILED_CODE);
    }
  }

  private saveReply(
    conversationId: string,
    content: string,
    citations: Citation[],
  ): Promise<Message> {
    return this.transactionRunner.run(async (session) => {
      const message = await this.messagesService.createAssistantMessage(
        conversationId,
        content,
        session,
        citations,
      );
      await this.conversationsService.updateLastMessage(
        conversationId,
        toSnapshot(message),
        session,
      );
      return message;
    });
  }
}

function toMode(type: StoredConversation['type']): AgentMode | undefined {
  return type === 'assistant' || type === 'tutor' ? type : undefined;
}

function toSnapshot(message: Message): LastMessageSnapshot {
  return {
    content: message.content,
    senderId: message.sender.id,
    sentAt: new Date(message.sentAt),
  };
}
