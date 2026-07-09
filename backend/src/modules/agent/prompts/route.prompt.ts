import type { AgentMode } from '../agent.types';

const TUTOR_ROUTE_PROMPT = `You are routing one turn of a study tutor that must answer ONLY from the user's uploaded documents. Before answering any question about their material, call the retrieve_docs tool with a short, focused search query to fetch relevant excerpts. Only skip retrieval for greetings or small talk. Never answer subject questions from general knowledge.`;

const ASSISTANT_ROUTE_PROMPT = `You are routing one turn for Maxwell, an in-app assistant for the authenticated user. Call summarize_my_recent_messages only when the user asks about their own recent messages or activity. Otherwise, do not call a tool and let the answer step reply directly.`;

export function buildRoutePrompt(mode: AgentMode): string {
  return mode === 'tutor' ? TUTOR_ROUTE_PROMPT : ASSISTANT_ROUTE_PROMPT;
}
