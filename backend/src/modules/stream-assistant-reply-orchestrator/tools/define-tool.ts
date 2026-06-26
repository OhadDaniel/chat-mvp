import { z } from 'zod';
import type { MessagesService } from '../../messages/messages.service';
import type { ProviderToolSpec } from '../../ai-assistant/llm-abstraction/llm.types';

export type ToolContext = {
  userId: string;
  messages: MessagesService;
};

export type AssistantTool = {
  name: string;
  description: string;
  spec: ProviderToolSpec;
  run: (rawInput: unknown, context: ToolContext) => Promise<unknown>;
};

export function defineTool<
  InputSchema extends z.ZodType,
  OutputSchema extends z.ZodType,
>(config: {
  name: string;
  description: string;
  inputSchema: InputSchema;
  outputSchema: OutputSchema;
  execute: (
    input: z.infer<InputSchema>,
    context: ToolContext,
  ) => Promise<z.infer<OutputSchema>>;
}): AssistantTool {
  return {
    name: config.name,
    description: config.description,
    spec: {
      name: config.name,
      description: config.description,
      parameters: z.toJSONSchema(config.inputSchema) as Record<string, unknown>,
    },
    run: async (rawInput, context) => {
      const input = config.inputSchema.parse(rawInput) as z.infer<InputSchema>;
      const output = await config.execute(input, context);
      return config.outputSchema.parse(output);
    },
  };
}
