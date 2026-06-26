import { buildHistory, HISTORY_LIMIT } from './conversation-history';
import { ASSISTANT_SENDER_ID } from '../messages/messages.constants';
import type { StoredMessage } from '../messages/messages.types';

function stored(
  id: string,
  senderId: string,
  content: string,
  sentAt: string,
): StoredMessage {
  return { id, conversationId: 'conv-1', senderId, content, sentAt };
}

describe('buildHistory', () => {
  it('orders oldest-first and maps the sender to a role', () => {
    const messages = [
      stored('m2', ASSISTANT_SENDER_ID, 'reply', '2026-01-01T00:01:00.000Z'),
      stored('m1', 'user-1', 'question', '2026-01-01T00:00:00.000Z'),
    ];

    expect(buildHistory(messages)).toEqual([
      { role: 'user', content: 'question' },
      { role: 'assistant', content: 'reply' },
    ]);
  });

  it('keeps only the most recent HISTORY_LIMIT messages', () => {
    const messages = Array.from({ length: HISTORY_LIMIT + 5 }, (_, i) =>
      stored(
        `m${i}`,
        'user-1',
        `msg ${i}`,
        `2026-01-01T00:${String(i).padStart(2, '0')}:00.000Z`,
      ),
    );

    const result = buildHistory(messages);

    expect(result).toHaveLength(HISTORY_LIMIT);
    expect(result[0].content).toBe('msg 5');
    expect(result[HISTORY_LIMIT - 1].content).toBe(`msg ${HISTORY_LIMIT + 4}`);
  });

  it('skips empty and whitespace-only messages', () => {
    const messages = [
      stored('m1', 'user-1', 'real', '2026-01-01T00:00:00.000Z'),
      stored('m2', 'user-1', '   ', '2026-01-01T00:01:00.000Z'),
      stored('m3', ASSISTANT_SENDER_ID, '', '2026-01-01T00:02:00.000Z'),
    ];

    expect(buildHistory(messages)).toEqual([{ role: 'user', content: 'real' }]);
  });
});
