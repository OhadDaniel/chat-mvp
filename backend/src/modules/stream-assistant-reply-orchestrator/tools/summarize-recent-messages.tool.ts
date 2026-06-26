import { z } from 'zod';
import { defineTool } from './define-tool';

const MIN_LIMIT = 1;
const MAX_LIMIT = 50;

const inputSchema = z.object({
  limit: z.number().int().min(MIN_LIMIT).max(MAX_LIMIT),
});

const outputSchema = z.object({
  messages: z.array(
    z.object({
      content: z.string(),
      sentAt: z.string(),
    }),
  ),
});

export const summarizeRecentMessagesTool = defineTool({
  name: 'summarize_my_recent_messages',
  description:
    "Returns the authenticated user's most recent messages (the ones they sent) so you can summarize them. Use only when the user asks about their own recent messages or activity.",
  inputSchema,
  outputSchema,
  execute: async (input, context) => {
    const recent = await context.messages.findRecentBySender(
      context.userId,
      input.limit,
    );
    return {
      messages: recent.map((message) => ({
        content: message.content,
        sentAt: message.sentAt,
      })),
    };
  },
});
