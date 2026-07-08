export type ProviderToolSpec = {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
};

export type ProviderToolCall = {
  id: string;
  name: string;
  arguments: string;
};

export type ProviderUserMessage = { role: 'user'; content: string };

export type ProviderAssistantMessage = {
  role: 'assistant';
  content: string;
  toolCalls?: ProviderToolCall[];
};

export type ProviderToolResultMessage = {
  role: 'tool';
  toolCallId: string;
  content: string;
};

export type ProviderMessage =
  | ProviderUserMessage
  | ProviderAssistantMessage
  | ProviderToolResultMessage;

export type ProviderRequest = {
  system: string;
  messages: ProviderMessage[];
  tools: ProviderToolSpec[];
};

export type TextDeltaEvent = { type: 'text_delta'; text: string };

export type ToolUseEvent = {
  type: 'tool_use';
  id: string;
  name: string;
  input: unknown;
};

export type ProviderStopReason = 'stop' | 'tool_calls' | 'length' | 'other';

export type MessageStopEvent = {
  type: 'message_stop';
  stopReason: ProviderStopReason;
};

export type ProviderStreamEvent =
  | TextDeltaEvent
  | ToolUseEvent
  | MessageStopEvent;
