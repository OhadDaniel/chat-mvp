import type { StreamMode } from '@langchain/langgraph';

export const RECENT_MESSAGES_LIMIT = 20;

export const SSE_EVENT_DELTA = 'delta';
export const SSE_EVENT_TOOL_CALL = 'tool_call';
export const SSE_EVENT_TOOL_RESULT = 'tool_result';
export const SSE_EVENT_DONE = 'done';
export const SSE_EVENT_ERROR = 'error';

export const NOT_REPLYABLE_CODE = 'CONVERSATION_NOT_FOUND';
export const NO_QUESTION_CODE = 'NO_QUESTION';
export const AGENT_STREAM_FAILED_CODE = 'AGENT_STREAM_FAILED';

export const AGENT_STREAM_MODES: StreamMode[] = ['custom', 'updates'];
