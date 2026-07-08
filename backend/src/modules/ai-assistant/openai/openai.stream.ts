import type OpenAI from 'openai';
import type {
  ProviderStopReason,
  ProviderStreamEvent,
  ToolUseEvent,
} from '../llm-abstraction/llm.types';

const FINISH_STOP = 'stop';
const FINISH_TOOL_CALLS = 'tool_calls';
const FINISH_LENGTH = 'length';

type ChunkChoice = OpenAI.ChatCompletionChunk['choices'][number];
type ToolCallDeltas = NonNullable<ChunkChoice['delta']['tool_calls']>;

type PartialToolCall = { id: string; name: string; arguments: string };

export async function* streamOpenAiChunks(
  stream: AsyncIterable<OpenAI.ChatCompletionChunk>,
): AsyncGenerator<ProviderStreamEvent> {
  const toolCalls = new Map<number, PartialToolCall>();

  for await (const chunk of stream) {
    const choice = chunk.choices[0];
    if (!choice) {
      continue;
    }

    if (choice.delta.content) {
      yield { type: 'text_delta', text: choice.delta.content };
    }

    accumulate(choice.delta.tool_calls, toolCalls);

    if (choice.finish_reason) {
      yield* emitToolUses(choice.finish_reason, toolCalls);
      yield {
        type: 'message_stop',
        stopReason: toStopReason(choice.finish_reason),
      };
    }
  }
}

function accumulate(
  deltas: ToolCallDeltas | undefined,
  toolCalls: Map<number, PartialToolCall>,
): void {
  if (!deltas) {
    return;
  }
  for (const delta of deltas) {
    const current = toolCalls.get(delta.index) ?? {
      id: '',
      name: '',
      arguments: '',
    };
    if (delta.id) {
      current.id = delta.id;
    }
    if (delta.function?.name) {
      current.name = delta.function.name;
    }
    if (delta.function?.arguments) {
      current.arguments += delta.function.arguments;
    }
    toolCalls.set(delta.index, current);
  }
}

function* emitToolUses(
  finishReason: string,
  toolCalls: Map<number, PartialToolCall>,
): Generator<ToolUseEvent> {
  if (finishReason !== FINISH_TOOL_CALLS) {
    return;
  }
  for (const call of toolCalls.values()) {
    yield {
      type: 'tool_use',
      id: call.id,
      name: call.name,
      input: parseArguments(call.arguments),
    };
  }
}

function parseArguments(raw: string): unknown {
  const trimmed = raw.trim();
  if (trimmed === '') {
    return {};
  }
  return JSON.parse(trimmed) as unknown;
}

function toStopReason(finishReason: string): ProviderStopReason {
  if (finishReason === FINISH_STOP) {
    return 'stop';
  }
  if (finishReason === FINISH_TOOL_CALLS) {
    return 'tool_calls';
  }
  if (finishReason === FINISH_LENGTH) {
    return 'length';
  }
  return 'other';
}
