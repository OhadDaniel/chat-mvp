import type { ProviderToolSpec } from '../../ai-assistant/llm-abstraction/llm.types';
import type { AssistantTool, ToolContext } from './define-tool';
import { summarizeRecentMessagesTool } from './summarize-recent-messages.tool';

export const ASSISTANT_TOOLS: AssistantTool[] = [summarizeRecentMessagesTool];

export function toProviderToolSpecs(): ProviderToolSpec[] {
  return ASSISTANT_TOOLS.map((tool) => tool.spec);
}

export function runTool(
  name: string,
  rawInput: unknown,
  context: ToolContext,
): Promise<unknown> {
  const tool = ASSISTANT_TOOLS.find((candidate) => candidate.name === name);
  if (!tool) {
    throw new Error(`Unknown tool requested: ${name}`);
  }
  return tool.run(rawInput, context);
}
