import { SystemMessage } from '@langchain/core/messages';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { RunnableConfig } from '@langchain/core/runnables';
import { readAgentConfig } from '../agent.config';
import { buildRoutePrompt } from '../prompts/route.prompt';
import type { AgentStateType, AgentUpdate } from '../agent.state';

export type BoundChatModel = ReturnType<NonNullable<BaseChatModel['bindTools']>>;

export function createRouteNode(model: BoundChatModel) {
  return async (
    state: AgentStateType,
    config?: RunnableConfig,
  ): Promise<AgentUpdate> => {
    const { mode } = readAgentConfig(config);
    const response = await model.invoke([
      new SystemMessage(buildRoutePrompt(mode)),
      ...state.messages,
    ]);
    return { messages: [response] };
  };
}
