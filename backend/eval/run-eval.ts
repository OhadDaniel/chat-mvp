import 'reflect-metadata';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as dotenv from 'dotenv';
import { OpenAIProvider } from '../src/modules/ai-assistant/openai/openai.provider';
import { ASSISTANT_SYSTEM_PROMPT } from '../src/modules/ai-assistant/prompts/system.prompt';
import {
  runTool,
  toProviderToolSpecs,
} from '../src/modules/stream-assistant-reply-orchestrator/tools/assistant-tools';
import type { ToolContext } from '../src/modules/stream-assistant-reply-orchestrator/tools/define-tool';
import type { ConfigService } from '@nestjs/config';
import type { MessagesService } from '../src/modules/messages/messages.service';
import type { StoredMessage } from '../src/modules/messages/messages.types';
import type {
  ProviderMessage,
  ToolUseEvent,
} from '../src/modules/ai-assistant/llm-abstraction/llm.types';

dotenv.config({ quiet: true });

const MAX_TOOL_ROUNDS = 3;

type EvalCase = { name: string; prompt: string; expect: string };

const SAMPLE_MESSAGES: StoredMessage[] = [
  {
    id: 's1',
    conversationId: 'c1',
    senderId: 'eval-user',
    content: 'Pushed the auth fix — tests are green.',
    sentAt: '2026-06-20T09:00:00.000Z',
  },
  {
    id: 's2',
    conversationId: 'c2',
    senderId: 'eval-user',
    content: 'Lunch at 1?',
    sentAt: '2026-06-20T11:30:00.000Z',
  },
  {
    id: 's3',
    conversationId: 'c1',
    senderId: 'eval-user',
    content: 'Can you review my PR today?',
    sentAt: '2026-06-20T14:15:00.000Z',
  },
];

const evalContext: ToolContext = {
  userId: 'eval-user',
  messages: {
    findRecentBySender: (
      _userId: string,
      limit: number,
    ): Promise<StoredMessage[]> => Promise.resolve(SAMPLE_MESSAGES.slice(0, limit)),
  } as unknown as MessagesService,
};

async function ask(
  provider: OpenAIProvider,
  prompt: string,
): Promise<{ text: string; toolsUsed: string[] }> {
  const messages: ProviderMessage[] = [{ role: 'user', content: prompt }];
  const toolsUsed: string[] = [];
  let text = '';

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    let turnText = '';
    const toolUses: ToolUseEvent[] = [];
    for await (const event of provider.streamMessage({
      system: ASSISTANT_SYSTEM_PROMPT,
      messages,
      tools: toProviderToolSpecs(),
    })) {
      if (event.type === 'text_delta') {
        turnText += event.text;
      } else if (event.type === 'tool_use') {
        toolUses.push(event);
      }
    }
    text += turnText;
    if (toolUses.length === 0) {
      break;
    }
    messages.push({
      role: 'assistant',
      content: turnText,
      toolCalls: toolUses.map((use) => ({
        id: use.id,
        name: use.name,
        arguments: JSON.stringify(use.input),
      })),
    });
    for (const use of toolUses) {
      toolsUsed.push(use.name);
      const result = await runTool(use.name, use.input, evalContext);
      messages.push({
        role: 'tool',
        toolCallId: use.id,
        content: JSON.stringify(result),
      });
    }
  }

  return { text, toolsUsed };
}

async function main(): Promise<void> {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set — add it to backend/.env to run the eval.');
    process.exit(1);
  }

  const config = {
    get: (key: string) => process.env[key],
  } as unknown as ConfigService;
  const provider = new OpenAIProvider(config);
  const cases = JSON.parse(
    readFileSync(join(__dirname, 'assistant.eval.json'), 'utf8'),
  ) as EvalCase[];

  for (const evalCase of cases) {
    const { text, toolsUsed } = await ask(provider, evalCase.prompt);
    console.log('\n=== ' + evalCase.name + ' ===');
    console.log('prompt:   ' + evalCase.prompt);
    console.log('expect:   ' + evalCase.expect);
    console.log('tools:    ' + (toolsUsed.length > 0 ? toolsUsed.join(', ') : 'none'));
    console.log('response: ' + (text.trim() || '(no text returned)'));
  }
}

void main();
