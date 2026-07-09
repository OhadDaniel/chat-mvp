import { isAIMessage } from '@langchain/core/messages';
import type { AgentStateType, AgentUpdate } from '../agent.state';

export function createToolCallNode() {
  return async (state: AgentStateType): Promise<AgentUpdate> => {
    const last = state.messages[state.messages.length - 1];
    const toolCall =
      last !== undefined && isAIMessage(last) ? last.tool_calls?.[0] : undefined;
    if (toolCall === undefined) {
      return { lastToolCall: null };
    }
    return {
      lastToolCall: { id: toolCall.id ?? toolCall.name, name: toolCall.name },
    };
  };
}
