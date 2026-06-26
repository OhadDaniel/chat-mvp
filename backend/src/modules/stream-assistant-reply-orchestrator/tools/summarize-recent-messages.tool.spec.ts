import { summarizeRecentMessagesTool } from './summarize-recent-messages.tool';
import type { ToolContext } from './define-tool';
import type { MessagesService } from '../../messages/messages.service';
import type { StoredMessage } from '../../messages/messages.types';

function contextWith(
  findRecentBySender: MessagesService['findRecentBySender'],
): ToolContext {
  return {
    userId: 'user-1',
    messages: { findRecentBySender } as unknown as MessagesService,
  };
}

describe('summarize_my_recent_messages tool', () => {
  it('rejects input outside the allowed range or non-integer', async () => {
    const ctx = contextWith(jest.fn());

    await expect(summarizeRecentMessagesTool.run({ limit: 0 }, ctx)).rejects.toThrow();
    await expect(
      summarizeRecentMessagesTool.run({ limit: 999 }, ctx),
    ).rejects.toThrow();
    await expect(
      summarizeRecentMessagesTool.run({ limit: 1.5 }, ctx),
    ).rejects.toThrow();
  });

  it('queries only the caller and returns the validated shape', async () => {
    const stored: StoredMessage[] = [
      {
        id: 'm1',
        conversationId: 'c1',
        senderId: 'user-1',
        content: 'hey',
        sentAt: '2026-01-01T00:00:00.000Z',
      },
    ];
    const findRecentBySender = jest.fn(() => Promise.resolve(stored));
    const ctx = contextWith(findRecentBySender);

    const result = await summarizeRecentMessagesTool.run({ limit: 5 }, ctx);

    expect(findRecentBySender).toHaveBeenCalledWith('user-1', 5);
    expect(result).toEqual({
      messages: [{ content: 'hey', sentAt: '2026-01-01T00:00:00.000Z' }],
    });
  });
});
