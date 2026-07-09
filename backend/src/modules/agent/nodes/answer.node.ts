import { SystemMessage } from '@langchain/core/messages';
import type { AIMessageChunk } from '@langchain/core/messages';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { getWriter } from '@langchain/langgraph';
import type { LangGraphRunnableConfig } from '@langchain/langgraph';
import { readAgentConfig } from '../agent.config';
import { AGENT_TOKEN_KEY } from '../agent.constants';
import { extractMessageText } from '../agent.mappers';
import { ASSISTANT_SYSTEM_PROMPT } from '../prompts/assistant.prompt';
import { TUTOR_SYSTEM_PROMPT } from '../prompts/tutor.prompt';
import type { AgentStateType, AgentUpdate } from '../agent.state';

export function createAnswerNode(model: BaseChatModel) {
  return async (
    state: AgentStateType,
    config: LangGraphRunnableConfig,
  ): Promise<AgentUpdate> => {
    const { mode } = readAgentConfig(config);
    const systemPrompt =
      mode === 'tutor' ? TUTOR_SYSTEM_PROMPT : ASSISTANT_SYSTEM_PROMPT;
    const writer = getWriter(config);
    const stream = await model.stream([
      new SystemMessage(systemPrompt),
      ...state.messages,
    ]);

    let aggregated: AIMessageChunk | undefined;
    for await (const chunk of stream) {
      aggregated = aggregated === undefined ? chunk : aggregated.concat(chunk);
      const text = extractMessageText(chunk.content);
      if (text.length > 0 && writer !== undefined) {
        writer({ [AGENT_TOKEN_KEY]: text });
      }
    }

    return aggregated === undefined
      ? { messages: [] }
      : { messages: [aggregated] };
  };
}
