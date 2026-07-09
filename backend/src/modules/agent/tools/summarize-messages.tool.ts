import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import type { RunnableConfig } from '@langchain/core/runnables';
import { readAgentConfig } from '../agent.config';
import { SUMMARIZE_MESSAGES_TOOL } from '../agent.constants';
import type { MessagesService } from '../../messages/messages.service';

export type SummarizeDeps = {
  messages: MessagesService;
};

const MIN_LIMIT = 1;
const MAX_LIMIT = 50;

const schema = z.object({
  limit: z.number().int().min(MIN_LIMIT).max(MAX_LIMIT),
});

export function createSummarizeMessagesTool(deps: SummarizeDeps) {
  return tool(
    async (input: z.infer<typeof schema>, config?: RunnableConfig) => {
      const { userId } = readAgentConfig(config);
      const recent = await deps.messages.findRecentBySender(userId, input.limit);
      return JSON.stringify({
        messages: recent.map((message) => ({
          content: message.content,
          sentAt: message.sentAt,
        })),
      });
    },
    {
      name: SUMMARIZE_MESSAGES_TOOL,
      description:
        "Returns the authenticated user's most recent messages (the ones they sent) so you can summarize them. Use only when the user asks about their own recent messages or activity.",
      schema,
    },
  );
}
