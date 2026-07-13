import { Annotation, MessagesAnnotation } from '@langchain/langgraph';
import type { RetrievedChunk } from '../knowledge/knowledge.types';
import type { Citation } from '../messages/messages.types';
import type { ToolCallInfo } from './agent.types';

export const AgentState = Annotation.Root({
  ...MessagesAnnotation.spec,
  retrievedChunks: Annotation<RetrievedChunk[]>({
    reducer: (_current, update) => update,
    default: () => [],
  }),
  citations: Annotation<Citation[]>({
    reducer: (_current, update) => update,
    default: () => [],
  }),
  lastToolCall: Annotation<ToolCallInfo | null>({
    reducer: (_current, update) => update,
    default: () => null,
  }),
});

export type AgentStateType = typeof AgentState.State;
export type AgentUpdate = typeof AgentState.Update;
