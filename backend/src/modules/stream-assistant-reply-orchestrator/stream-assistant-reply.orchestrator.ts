import { Injectable, Logger } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { ConversationNotFoundError } from '../conversations/errors/conversation-not-found.error';
import { MessagesService } from '../messages/messages.service';
import { TransactionRunner } from '../mongo/transaction.runner';
import { LlmProvider } from '../ai-assistant/llm-abstraction/llm-provider';
import { ASSISTANT_SYSTEM_PROMPT } from '../ai-assistant/prompts/system.prompt';
import { buildHistory, HISTORY_LIMIT } from './conversation-history';
import { runTool, toProviderToolSpecs } from './tools/assistant-tools';
import type { ToolContext } from './tools/define-tool';
import type { SseWriter } from './sse-writer';
import type { User } from '../users/users.types';
import type { Message } from '../messages/messages.types';
import type { LastMessageSnapshot } from '../conversations/conversations.types';
import type { CreateMessageDto } from '../messages/dto/create-message.request.dto';
import type {
  ProviderMessage,
  ProviderToolCall,
  ToolUseEvent,
} from '../ai-assistant/llm-abstraction/llm.types';

const STREAM_ERROR_CODE = 'ASSISTANT_STREAM_FAILED';
const MAX_TOOL_ROUNDS = 3;

type Turn = { text: string; toolUses: ToolUseEvent[] };

@Injectable()
export class StreamAssistantReplyOrchestrator {
  private readonly logger = new Logger(StreamAssistantReplyOrchestrator.name);

  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: MessagesService,
    private readonly transactionRunner: TransactionRunner,
    private readonly llmProvider: LlmProvider,
  ) {}

  async execute(
    conversationId: string,
    user: User,
    dto: CreateMessageDto,
    sse: SseWriter,
  ): Promise<void> {
    const conversation = await this.conversationsService.getForParticipant(
      conversationId,
      user.id,
    );
    if (conversation.type !== 'assistant') {
      throw new ConversationNotFoundError();
    }

    await this.saveUserMessage(conversationId, user, dto);
    const history = buildHistory(
      await this.messagesService.loadRecent(conversationId, HISTORY_LIMIT),
    );
    const context: ToolContext = {
      userId: user.id,
      messages: this.messagesService,
    };

    sse.open();
    try {
      const replyText = await this.generateReply(history, sse, context);
      const reply = await this.saveAssistantMessage(conversationId, replyText);
      sse.done(reply.id);
    } catch (error) {
      this.logger.error('Assistant reply stream failed', error);
      sse.error(STREAM_ERROR_CODE);
    } finally {
      sse.end();
    }
  }

  private async generateReply(
    history: ProviderMessage[],
    sse: SseWriter,
    context: ToolContext,
  ): Promise<string> {
    const messages: ProviderMessage[] = [...history];
    let replyText = '';

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const turn = await this.runTurn(messages, sse);
      replyText += turn.text;
      if (turn.toolUses.length === 0) {
        return replyText;
      }

      messages.push(toAssistantTurn(turn.text, turn.toolUses));
      for (const use of turn.toolUses) {
        const result = await runTool(use.name, use.input, context);
        messages.push(toToolResult(use.id, result));
      }
    }

    return replyText;
  }

  private async runTurn(
    messages: ProviderMessage[],
    sse: SseWriter,
  ): Promise<Turn> {
    let text = '';
    const toolUses: ToolUseEvent[] = [];
    const stream = this.llmProvider.streamMessage({
      system: ASSISTANT_SYSTEM_PROMPT,
      messages,
      tools: toProviderToolSpecs(),
    });
    for await (const event of stream) {
      if (event.type === 'text_delta') {
        text += event.text;
        sse.delta(event.text);
      } else if (event.type === 'tool_use') {
        toolUses.push(event);
      }
    }
    return { text, toolUses };
  }

  private saveUserMessage(
    conversationId: string,
    user: User,
    dto: CreateMessageDto,
  ): Promise<void> {
    return this.transactionRunner.run(async (session) => {
      const message = await this.messagesService.create(
        conversationId,
        user,
        dto,
        session,
      );
      await this.conversationsService.updateLastMessage(
        conversationId,
        toSnapshot(message),
        session,
      );
    });
  }

  private saveAssistantMessage(
    conversationId: string,
    content: string,
  ): Promise<Message> {
    return this.transactionRunner.run(async (session) => {
      const message = await this.messagesService.createAssistantMessage(
        conversationId,
        content,
        session,
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

function toAssistantTurn(text: string, toolUses: ToolUseEvent[]): ProviderMessage {
  return {
    role: 'assistant',
    content: text,
    toolCalls: toolUses.map(toProviderToolCall),
  };
}

function toProviderToolCall(use: ToolUseEvent): ProviderToolCall {
  return {
    id: use.id,
    name: use.name,
    arguments: JSON.stringify(use.input),
  };
}

function toToolResult(toolCallId: string, result: unknown): ProviderMessage {
  return {
    role: 'tool',
    toolCallId,
    content: JSON.stringify(result),
  };
}

function toSnapshot(message: Message): LastMessageSnapshot {
  return {
    content: message.content,
    senderId: message.sender.id,
    sentAt: new Date(message.sentAt),
  };
}
