import { ToolMessage, isAIMessage } from '@langchain/core/messages';
import type { RunnableConfig } from '@langchain/core/runnables';
import { RETRIEVE_DOCS_TOOL } from '../agent.constants';
import { buildCitations } from '../agent.mappers';
import { retrieveContext } from '../tools/retrieve-docs.tool';
import type { RetrieveDeps } from '../tools/retrieve-docs.tool';
import type { AgentStateType, AgentUpdate } from '../agent.state';

export function createRetrieveNode(deps: RetrieveDeps) {
  return async (
    state: AgentStateType,
    config?: RunnableConfig,
  ): Promise<AgentUpdate> => {
    const last = state.messages[state.messages.length - 1];
    const toolCall =
      last !== undefined && isAIMessage(last)
        ? last.tool_calls?.find((call) => call.name === RETRIEVE_DOCS_TOOL)
        : undefined;
    const query = readQuery(toolCall?.args);
    const { chunks, contextBlock } = await retrieveContext(deps, config, query);
    const toolCallId = toolCall?.id ?? RETRIEVE_DOCS_TOOL;
    const toolMessage = new ToolMessage({
      content: contextBlock,
      tool_call_id: toolCallId,
      name: RETRIEVE_DOCS_TOOL,
    });
    return {
      messages: [toolMessage],
      retrievedChunks: chunks,
      citations: buildCitations(chunks),
      lastToolCall: { id: toolCallId, name: RETRIEVE_DOCS_TOOL },
    };
  };
}

function readQuery(args: Record<string, unknown> | undefined): string {
  const query = args?.query;
  return typeof query === 'string' ? query : '';
}
