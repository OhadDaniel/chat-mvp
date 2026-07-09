import { AIMessage, ToolMessage } from '@langchain/core/messages';
import {
  AGENT_NODES,
  RETRIEVE_DOCS_TOOL,
  SUMMARIZE_MESSAGES_TOOL,
} from '../agent/agent.constants';
import {
  readCitations,
  readCustomToken,
  readUpdateEvents,
} from './stream-agent-reply.mappers';

describe('stream-agent-reply mappers', () => {
  describe('readCustomToken', () => {
    it('extracts a token from a custom stream frame', () => {
      expect(readCustomToken(['custom', { token: 'Hi' }])).toBe('Hi');
    });

    it('ignores non-custom frames', () => {
      expect(readCustomToken(['updates', { route: {} }])).toBeUndefined();
      expect(readCustomToken('nope')).toBeUndefined();
    });
  });

  describe('readUpdateEvents', () => {
    it('emits a tool_call for each route tool call', () => {
      const routeMessage = new AIMessage({
        content: '',
        tool_calls: [
          {
            name: RETRIEVE_DOCS_TOOL,
            args: { query: 'x' },
            id: 't1',
            type: 'tool_call',
          },
        ],
      });

      const events = readUpdateEvents([
        'updates',
        { [AGENT_NODES.ROUTE]: { messages: [routeMessage] } },
      ]);

      expect(events).toEqual([
        { type: 'tool_call', data: { id: 't1', name: RETRIEVE_DOCS_TOOL } },
      ]);
    });

    it('emits a tool_result for a retrieve node update', () => {
      const events = readUpdateEvents([
        'updates',
        { [AGENT_NODES.RETRIEVE]: { messages: [], citations: [] } },
      ]);

      expect(events).toEqual([
        {
          type: 'tool_result',
          data: { id: RETRIEVE_DOCS_TOOL, name: RETRIEVE_DOCS_TOOL },
        },
      ]);
    });

    it('emits a tool_result for a user-data tool node update', () => {
      const toolMessage = new ToolMessage({
        content: '{}',
        tool_call_id: 't2',
        name: SUMMARIZE_MESSAGES_TOOL,
      });

      const events = readUpdateEvents([
        'updates',
        { [AGENT_NODES.TOOL_RESULT]: { messages: [toolMessage] } },
      ]);

      expect(events).toEqual([
        {
          type: 'tool_result',
          data: { id: 't2', name: SUMMARIZE_MESSAGES_TOOL },
        },
      ]);
    });
  });

  describe('readCitations', () => {
    it('keeps only well-formed citations from graph state values', () => {
      const values = {
        citations: [
          { chunkId: 'k1', documentName: 'doc.pdf', text: 'excerpt' },
          { chunkId: 42 },
        ],
      };

      expect(readCitations(values)).toEqual([
        { chunkId: 'k1', documentName: 'doc.pdf', text: 'excerpt' },
      ]);
    });

    it('returns an empty array when values lack citations', () => {
      expect(readCitations({})).toEqual([]);
      expect(readCitations(undefined)).toEqual([]);
    });
  });
});
