import type { MessageEvent } from '@nestjs/common';
import { isAIMessage, isBaseMessage, isToolMessage } from '@langchain/core/messages';
import {
  AGENT_NODES,
  AGENT_TOKEN_KEY,
  RETRIEVE_DOCS_TOOL,
} from '../agent/agent.constants';
import type { Citation } from '../messages/messages.types';
import {
  SSE_EVENT_DELTA,
  SSE_EVENT_DONE,
  SSE_EVENT_ERROR,
  SSE_EVENT_TOOL_CALL,
  SSE_EVENT_TOOL_RESULT,
} from './stream-agent-reply.constants';

type ToolRef = { id: string; name: string };

export function deltaEvent(text: string): MessageEvent {
  return { type: SSE_EVENT_DELTA, data: { text } };
}

export function toolCallEvent(ref: ToolRef): MessageEvent {
  return { type: SSE_EVENT_TOOL_CALL, data: ref };
}

export function toolResultEvent(ref: ToolRef): MessageEvent {
  return { type: SSE_EVENT_TOOL_RESULT, data: ref };
}

export function doneEvent(messageId: string, citations: Citation[]): MessageEvent {
  return { type: SSE_EVENT_DONE, data: { messageId, citations } };
}

export function errorEvent(code: string): MessageEvent {
  return { type: SSE_EVENT_ERROR, data: { code } };
}

export function readCustomToken(chunk: unknown): string | undefined {
  const tuple = asModeTuple(chunk);
  if (tuple === undefined || tuple[0] !== 'custom') {
    return undefined;
  }
  if (!isRecord(tuple[1])) {
    return undefined;
  }
  const token = tuple[1][AGENT_TOKEN_KEY];
  return typeof token === 'string' ? token : undefined;
}

export function readUpdateEvents(chunk: unknown): MessageEvent[] {
  const tuple = asModeTuple(chunk);
  if (tuple === undefined || tuple[0] !== 'updates' || !isRecord(tuple[1])) {
    return [];
  }
  const update = tuple[1];
  const events: MessageEvent[] = [];
  for (const ref of toolCallsFrom(update[AGENT_NODES.ROUTE])) {
    events.push(toolCallEvent(ref));
  }
  if (isRecord(update[AGENT_NODES.RETRIEVE])) {
    events.push(
      toolResultEvent({ id: RETRIEVE_DOCS_TOOL, name: RETRIEVE_DOCS_TOOL }),
    );
  }
  for (const ref of toolResultsFrom(update[AGENT_NODES.TOOL_RESULT])) {
    events.push(toolResultEvent(ref));
  }
  return events;
}

export function readCitations(values: unknown): Citation[] {
  if (!isRecord(values) || !Array.isArray(values.citations)) {
    return [];
  }
  return values.citations.filter(isCitation);
}

function toolCallsFrom(update: unknown): ToolRef[] {
  if (!isRecord(update) || !Array.isArray(update.messages)) {
    return [];
  }
  const refs: ToolRef[] = [];
  for (const message of update.messages) {
    if (isBaseMessage(message) && isAIMessage(message)) {
      for (const call of message.tool_calls ?? []) {
        refs.push({ id: call.id ?? call.name, name: call.name });
      }
    }
  }
  return refs;
}

function toolResultsFrom(update: unknown): ToolRef[] {
  if (!isRecord(update) || !Array.isArray(update.messages)) {
    return [];
  }
  const refs: ToolRef[] = [];
  for (const message of update.messages) {
    if (isBaseMessage(message) && isToolMessage(message)) {
      refs.push({
        id: message.tool_call_id,
        name: message.name ?? message.tool_call_id,
      });
    }
  }
  return refs;
}

function asModeTuple(value: unknown): [string, unknown] | undefined {
  if (Array.isArray(value) && value.length >= 2 && typeof value[0] === 'string') {
    return [value[0], value[1]];
  }
  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isCitation(value: unknown): value is Citation {
  return (
    isRecord(value) &&
    typeof value.chunkId === 'string' &&
    typeof value.documentName === 'string' &&
    typeof value.text === 'string'
  );
}
