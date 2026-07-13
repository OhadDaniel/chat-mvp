import { AIMessage } from '@langchain/core/messages';
import {
  AGENT_NODES,
  RETRIEVE_DOCS_TOOL,
  SUMMARIZE_MESSAGES_TOOL,
} from '../agent.constants';
import { decideNext } from '../edges/decide-next';
import type { AgentStateType } from '../agent.state';

function stateWith(message: AIMessage): AgentStateType {
  return {
    messages: [message],
    retrievedChunks: [],
    citations: [],
    lastToolCall: null,
  };
}

describe('decideNext', () => {
  it('routes to retrieve when the model calls retrieve_docs', () => {
    const message = new AIMessage({
      content: '',
      tool_calls: [
        { name: RETRIEVE_DOCS_TOOL, args: { query: 'x' }, id: '1', type: 'tool_call' },
      ],
    });
    expect(decideNext(stateWith(message))).toBe(AGENT_NODES.RETRIEVE);
  });

  it('routes to tool_call for a user-data tool', () => {
    const message = new AIMessage({
      content: '',
      tool_calls: [
        { name: SUMMARIZE_MESSAGES_TOOL, args: { limit: 5 }, id: '2', type: 'tool_call' },
      ],
    });
    expect(decideNext(stateWith(message))).toBe(AGENT_NODES.TOOL_CALL);
  });

  it('routes to answer when there are no tool calls', () => {
    expect(decideNext(stateWith(new AIMessage({ content: 'done' })))).toBe(
      AGENT_NODES.ANSWER,
    );
  });
});
