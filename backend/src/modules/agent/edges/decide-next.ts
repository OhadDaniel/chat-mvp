import { isAIMessage } from '@langchain/core/messages';
import { AGENT_NODES, RETRIEVE_DOCS_TOOL } from '../agent.constants';
import type { AgentStateType } from '../agent.state';

type AgentBranch =
  | typeof AGENT_NODES.RETRIEVE
  | typeof AGENT_NODES.TOOL_CALL
  | typeof AGENT_NODES.ANSWER;

export function decideNext(state: AgentStateType): AgentBranch {
  const last = state.messages[state.messages.length - 1];
  const toolCalls =
    last !== undefined && isAIMessage(last) ? (last.tool_calls ?? []) : [];
  const firstCall = toolCalls[0];
  if (firstCall === undefined) {
    return AGENT_NODES.ANSWER;
  }
  if (firstCall.name === RETRIEVE_DOCS_TOOL) {
    return AGENT_NODES.RETRIEVE;
  }
  return AGENT_NODES.TOOL_CALL;
}
