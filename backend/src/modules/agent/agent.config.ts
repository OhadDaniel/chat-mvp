import type { RunnableConfig } from '@langchain/core/runnables';
import { AgentConfigError } from './errors/agent-config.error';
import type { AgentMode } from './agent.types';

export type AgentRuntimeContext = {
  userId: string;
  conversationId: string;
  mode: AgentMode;
};

export function readAgentConfig(
  config: RunnableConfig | undefined,
): AgentRuntimeContext {
  const configurable = (config?.configurable ?? {}) as Record<string, unknown>;
  const userId = configurable.userId;
  const conversationId = configurable.conversationId;
  const mode = configurable.mode;
  if (
    typeof userId !== 'string' ||
    typeof conversationId !== 'string' ||
    (mode !== 'assistant' && mode !== 'tutor')
  ) {
    throw new AgentConfigError();
  }
  return { userId, conversationId, mode };
}
