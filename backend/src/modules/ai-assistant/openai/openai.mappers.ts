import type OpenAI from 'openai';
import type {
  ProviderMessage,
  ProviderRequest,
  ProviderToolCall,
  ProviderToolSpec,
} from '../llm-abstraction/llm.types';

export function toOpenAiMessages(
  request: ProviderRequest,
): OpenAI.ChatCompletionMessageParam[] {
  return [
    { role: 'system', content: request.system },
    ...request.messages.map(toOpenAiMessage),
  ];
}

function toOpenAiMessage(
  message: ProviderMessage,
): OpenAI.ChatCompletionMessageParam {
  switch (message.role) {
    case 'user':
      return { role: 'user', content: message.content };
    case 'assistant':
      return toAssistantMessage(message);
    case 'tool':
      return {
        role: 'tool',
        tool_call_id: message.toolCallId,
        content: message.content,
      };
    default: {
      const _exhaustive: never = message;
      return _exhaustive;
    }
  }
}

function toAssistantMessage(
  message: Extract<ProviderMessage, { role: 'assistant' }>,
): OpenAI.ChatCompletionAssistantMessageParam {
  if (!message.toolCalls || message.toolCalls.length === 0) {
    return { role: 'assistant', content: message.content };
  }
  return {
    role: 'assistant',
    content: message.content,
    tool_calls: message.toolCalls.map(toOpenAiToolCall),
  };
}

function toOpenAiToolCall(
  call: ProviderToolCall,
): OpenAI.ChatCompletionMessageToolCall {
  return {
    id: call.id,
    type: 'function',
    function: { name: call.name, arguments: call.arguments },
  };
}

export function toOpenAiTools(
  tools: ProviderToolSpec[],
): OpenAI.ChatCompletionTool[] | undefined {
  if (tools.length === 0) {
    return undefined;
  }
  return tools.map((tool) => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  }));
}
