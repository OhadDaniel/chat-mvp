import type OpenAI from 'openai';
import { streamOpenAiChunks } from '../openai.stream';
import type { ProviderStreamEvent } from '../../llm-abstraction/llm.types';

type Chunk = OpenAI.ChatCompletionChunk;
type Choice = Chunk['choices'][number];
type Delta = Choice['delta'];

function makeChunk(
  delta: Delta,
  finishReason: Choice['finish_reason'] = null,
): Chunk {
  return {
    id: 'chunk',
    object: 'chat.completion.chunk',
    created: 0,
    model: 'gpt-4o-mini',
    choices: [{ index: 0, delta, finish_reason: finishReason }],
  };
}

async function* toStream(chunks: Chunk[]): AsyncGenerator<Chunk> {
  for (const chunk of chunks) {
    yield chunk;
  }
}

async function collect(chunks: Chunk[]): Promise<ProviderStreamEvent[]> {
  const events: ProviderStreamEvent[] = [];
  for await (const event of streamOpenAiChunks(toStream(chunks))) {
    events.push(event);
  }
  return events;
}

describe('streamOpenAiChunks', () => {
  it('emits text deltas in order, then a stop', async () => {
    const events = await collect([
      makeChunk({ content: 'Hi' }),
      makeChunk({ content: ' there' }),
      makeChunk({ content: '!' }),
      makeChunk({}, 'stop'),
    ]);

    expect(events).toEqual([
      { type: 'text_delta', text: 'Hi' },
      { type: 'text_delta', text: ' there' },
      { type: 'text_delta', text: '!' },
      { type: 'message_stop', stopReason: 'stop' },
    ]);
  });

  it('reassembles a tool call split across chunks and parses its arguments', async () => {
    const events = await collect([
      makeChunk({
        tool_calls: [
          {
            index: 0,
            id: 'call_8f2',
            function: { name: 'summarize_my_recent_messages', arguments: '' },
          },
        ],
      }),
      makeChunk({ tool_calls: [{ index: 0, function: { arguments: '{"lim' } }] }),
      makeChunk({ tool_calls: [{ index: 0, function: { arguments: 'it":' } }] }),
      makeChunk({ tool_calls: [{ index: 0, function: { arguments: ' 5}' } }] }),
      makeChunk({}, 'tool_calls'),
    ]);

    expect(events).toEqual([
      {
        type: 'tool_use',
        id: 'call_8f2',
        name: 'summarize_my_recent_messages',
        input: { limit: 5 },
      },
      { type: 'message_stop', stopReason: 'tool_calls' },
    ]);
  });

  it('treats empty tool-call arguments as an empty input object', async () => {
    const events = await collect([
      makeChunk({
        tool_calls: [
          {
            index: 0,
            id: 'call_1',
            function: { name: 'list_my_conversations', arguments: '' },
          },
        ],
      }),
      makeChunk({}, 'tool_calls'),
    ]);

    expect(events).toEqual([
      { type: 'tool_use', id: 'call_1', name: 'list_my_conversations', input: {} },
      { type: 'message_stop', stopReason: 'tool_calls' },
    ]);
  });

  it('maps unknown finish reasons to "other"', async () => {
    const events = await collect([makeChunk({}, 'content_filter')]);
    expect(events).toEqual([{ type: 'message_stop', stopReason: 'other' }]);
  });

  it('skips chunks that carry no choice', async () => {
    const empty: Chunk = {
      id: 'chunk',
      object: 'chat.completion.chunk',
      created: 0,
      model: 'gpt-4o-mini',
      choices: [],
    };
    expect(await collect([empty])).toEqual([]);
  });

  it('throws on malformed tool-call arguments so the caller can surface it', async () => {
    const chunks = [
      makeChunk({
        tool_calls: [
          { index: 0, id: 'c', function: { name: 't', arguments: '{not json' } },
        ],
      }),
      makeChunk({}, 'tool_calls'),
    ];
    await expect(collect(chunks)).rejects.toThrow();
  });
});
