export const CHECKPOINT_COLLECTION = 'agent_checkpoints';
export const CHECKPOINT_WRITES_COLLECTION = 'agent_checkpoint_writes';

export const AGENT_NODES = {
  ROUTE: 'route',
  RETRIEVE: 'retrieve',
  TOOL_CALL: 'tool_call',
  TOOL_RESULT: 'tool_result',
  ANSWER: 'answer',
} as const;

export const RETRIEVE_DOCS_TOOL = 'retrieve_docs';
export const SUMMARIZE_MESSAGES_TOOL = 'summarize_my_recent_messages';

export const AGENT_TOKEN_KEY = 'token';
