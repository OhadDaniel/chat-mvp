import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import type { RunnableConfig } from '@langchain/core/runnables';
import { readAgentConfig } from '../agent.config';
import { RETRIEVE_DOCS_TOOL } from '../agent.constants';
import { buildContextBlock } from '../prompts/tutor.prompt';
import type { EmbeddingProvider } from '../../embedding/embedding-provider';
import type { KnowledgeService } from '../../knowledge/knowledge.service';
import type { RetrievedChunk } from '../../knowledge/knowledge.types';

export type RetrieveDeps = {
  embeddings: EmbeddingProvider;
  knowledge: KnowledgeService;
};

export type RetrieveResult = {
  chunks: RetrievedChunk[];
  contextBlock: string;
};

const schema = z.object({
  query: z.string().min(1),
});

export async function retrieveContext(
  deps: RetrieveDeps,
  config: RunnableConfig | undefined,
  query: string,
): Promise<RetrieveResult> {
  const { userId, conversationId } = readAgentConfig(config);
  const embeddings = await deps.embeddings.embed([query]);
  const embedding = embeddings[0];
  if (embedding === undefined) {
    return { chunks: [], contextBlock: buildContextBlock([]) };
  }
  const chunks = await deps.knowledge.search(userId, conversationId, embedding);
  return { chunks, contextBlock: buildContextBlock(chunks) };
}

export function createRetrieveDocsTool(deps: RetrieveDeps) {
  return tool(
    async (input: z.infer<typeof schema>, config?: RunnableConfig) => {
      const { contextBlock } = await retrieveContext(deps, config, input.query);
      return contextBlock;
    },
    {
      name: RETRIEVE_DOCS_TOOL,
      description:
        "Search the user's own uploaded documents for excerpts relevant to a query. Use to ground answers about their material.",
      schema,
    },
  );
}
