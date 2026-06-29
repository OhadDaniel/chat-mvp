import { Injectable, Logger } from '@nestjs/common';
import type { MessageEvent } from '@nestjs/common';
import { from, type Observable } from 'rxjs';
import { ConversationsService } from '../conversations/conversations.service';
import { MessagesService } from '../messages/messages.service';
import { EmbeddingProvider } from '../embedding/embedding-provider';
import { KnowledgeService } from '../knowledge/knowledge.service';
import { ChatModelProvider } from '../chat-model/chat-model-provider';
import { TransactionRunner } from '../mongo/transaction.runner';
import { buildContextBlock } from './tutor.prompt';
import { streamTutorAnswer } from './tutor-rag.chain';
import { buildCitations } from './build-citations';
import { latestQuestion } from './latest-question';
import {
  EMPTY_RETRIEVAL_ANSWER,
  NO_QUESTION_CODE,
  NOT_TUTOR_CODE,
  RECENT_MESSAGES_LIMIT,
  SSE_EVENT_DELTA,
  SSE_EVENT_DONE,
  SSE_EVENT_ERROR,
  TUTOR_STREAM_FAILED_CODE,
} from './stream-tutor-reply.constants';
import type { User } from '../users/users.types';
import type { Citation, Message } from '../messages/messages.types';
import type { LastMessageSnapshot } from '../conversations/conversations.types';
import type { RetrievedChunk } from '../knowledge/knowledge.types';

@Injectable()
export class StreamTutorReplyOrchestrator {
  private readonly logger = new Logger(StreamTutorReplyOrchestrator.name);

  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: MessagesService,
    private readonly embeddingProvider: EmbeddingProvider,
    private readonly knowledgeService: KnowledgeService,
    private readonly chatModelProvider: ChatModelProvider,
    private readonly transactionRunner: TransactionRunner,
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
    if (conversation.type !== 'tutor') {
      yield errorEvent(NOT_TUTOR_CODE);
      return;
    }

    const recent = await this.messagesService.loadRecent(
      conversationId,
      RECENT_MESSAGES_LIMIT,
    );
    const question = latestQuestion(recent);
    if (!question) {
      yield errorEvent(NO_QUESTION_CODE);
      return;
    }

    try {
      const [queryVector] = await this.embeddingProvider.embed([question]);
      const chunks = await this.knowledgeService.search(
        user.id,
        conversationId,
        queryVector,
      );
      const answer = yield* this.streamAnswer(chunks, question);
      const citations = buildCitations(chunks);
      const reply = await this.saveReply(conversationId, answer, citations);
      yield doneEvent(reply.id, citations);
    } catch (error) {
      this.logger.error('Tutor reply stream failed', error);
      yield errorEvent(TUTOR_STREAM_FAILED_CODE);
    }
  }

  private async *streamAnswer(
    chunks: RetrievedChunk[],
    question: string,
  ): AsyncGenerator<MessageEvent, string> {
    if (chunks.length === 0) {
      yield deltaEvent(EMPTY_RETRIEVAL_ANSWER);
      return EMPTY_RETRIEVAL_ANSWER;
    }

    const context = buildContextBlock(chunks);
    const model = this.chatModelProvider.getChatModel();
    const stream = await streamTutorAnswer(model, context, question);

    let answer = '';
    for await (const token of stream) {
      answer += token;
      yield deltaEvent(token);
    }
    return answer;
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

function deltaEvent(text: string): MessageEvent {
  return { type: SSE_EVENT_DELTA, data: { text } };
}

function doneEvent(messageId: string, citations: Citation[]): MessageEvent {
  return { type: SSE_EVENT_DONE, data: { messageId, citations } };
}

function errorEvent(code: string): MessageEvent {
  return { type: SSE_EVENT_ERROR, data: { code } };
}

function toSnapshot(message: Message): LastMessageSnapshot {
  return {
    content: message.content,
    senderId: message.sender.id,
    sentAt: new Date(message.sentAt),
  };
}
