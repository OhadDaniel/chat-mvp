import type { RunnableConfig } from '@langchain/core/runnables';
import type { MessagesService } from '../../messages/messages.service';
import type { StoredMessage } from '../../messages/messages.types';
import { createSummarizeMessagesTool } from '../tools/summarize-messages.tool';

describe('summarize_my_recent_messages tool', () => {
  it('scopes to the authenticated user from config, ignoring tool input', async () => {
    const recent: StoredMessage[] = [
      {
        id: 'm1',
        conversationId: 'c1',
        senderId: 'u1',
        content: 'hello',
        sentAt: '2026-01-01T00:00:00.000Z',
      },
    ];
    const findRecentBySender = jest.fn().mockResolvedValue(recent);
    const messages = { findRecentBySender } as unknown as MessagesService;
    const tool = createSummarizeMessagesTool({ messages });
    const config: RunnableConfig = {
      configurable: { userId: 'u1', conversationId: 'c1', mode: 'assistant' },
    };

    const output = await tool.invoke({ limit: 5 }, config);

    expect(findRecentBySender).toHaveBeenCalledWith('u1', 5);
    expect(JSON.parse(output)).toEqual({
      messages: [{ content: 'hello', sentAt: '2026-01-01T00:00:00.000Z' }],
    });
  });

  it('throws when the runtime user context is missing', async () => {
    const messages = {
      findRecentBySender: jest.fn(),
    } as unknown as MessagesService;
    const tool = createSummarizeMessagesTool({ messages });

    await expect(tool.invoke({ limit: 5 }, {})).rejects.toThrow();
  });
});
