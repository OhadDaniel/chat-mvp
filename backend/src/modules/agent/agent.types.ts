export type AgentMode = 'assistant' | 'tutor';

export type ToolCallInfo = {
  id: string;
  name: string;
};

export type AgentConfigurable = {
  thread_id: string;
  userId: string;
  conversationId: string;
  mode: AgentMode;
};
