import { Injectable } from '@nestjs/common';
import { END, START, StateGraph } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { MongoDBSaver } from '@langchain/langgraph-checkpoint-mongodb';
import { ChatModelProvider } from '../chat-model/chat-model-provider';
import { ChatModelUnavailableError } from '../chat-model/errors/chat-model-unavailable.error';
import { EmbeddingProvider } from '../embedding/embedding-provider';
import { KnowledgeService } from '../knowledge/knowledge.service';
import { MessagesService } from '../messages/messages.service';
import { AGENT_NODES } from './agent.constants';
import { AgentState } from './agent.state';
import { MongoCheckpointerProvider } from './checkpointer/mongo-checkpointer.provider';
import { decideNext } from './edges/decide-next';
import { createAnswerNode } from './nodes/answer.node';
import { createRetrieveNode } from './nodes/retrieve.node';
import { createRouteNode } from './nodes/route.node';
import { createToolCallNode } from './nodes/tool-call.node';
import { createRetrieveDocsTool } from './tools/retrieve-docs.tool';
import { createSummarizeMessagesTool } from './tools/summarize-messages.tool';

export type AgentGraphDeps = {
  chatModel: BaseChatModel;
  embeddings: EmbeddingProvider;
  knowledge: KnowledgeService;
  messages: MessagesService;
  checkpointer: MongoDBSaver;
};

export function buildAgentGraph(deps: AgentGraphDeps) {
  if (!deps.chatModel.bindTools) {
    throw new ChatModelUnavailableError();
  }
  const retrieveDeps = {
    embeddings: deps.embeddings,
    knowledge: deps.knowledge,
  };
  const retrieveDocsTool = createRetrieveDocsTool(retrieveDeps);
  const summarizeTool = createSummarizeMessagesTool({ messages: deps.messages });
  const routingModel = deps.chatModel.bindTools([
    retrieveDocsTool,
    summarizeTool,
  ]);

  return new StateGraph(AgentState)
    .addNode(AGENT_NODES.ROUTE, createRouteNode(routingModel))
    .addNode(AGENT_NODES.RETRIEVE, createRetrieveNode(retrieveDeps))
    .addNode(AGENT_NODES.TOOL_CALL, createToolCallNode())
    .addNode(AGENT_NODES.TOOL_RESULT, new ToolNode([summarizeTool]))
    .addNode(AGENT_NODES.ANSWER, createAnswerNode(deps.chatModel))
    .addEdge(START, AGENT_NODES.ROUTE)
    .addConditionalEdges(AGENT_NODES.ROUTE, decideNext, [
      AGENT_NODES.RETRIEVE,
      AGENT_NODES.TOOL_CALL,
      AGENT_NODES.ANSWER,
    ])
    .addEdge(AGENT_NODES.RETRIEVE, AGENT_NODES.ROUTE)
    .addEdge(AGENT_NODES.TOOL_CALL, AGENT_NODES.TOOL_RESULT)
    .addEdge(AGENT_NODES.TOOL_RESULT, AGENT_NODES.ROUTE)
    .addEdge(AGENT_NODES.ANSWER, END)
    .compile({ checkpointer: deps.checkpointer });
}

export type CompiledAgentGraph = ReturnType<typeof buildAgentGraph>;

@Injectable()
export class AgentGraph {
  private compiled: CompiledAgentGraph | undefined;

  constructor(
    private readonly chatModelProvider: ChatModelProvider,
    private readonly embeddingProvider: EmbeddingProvider,
    private readonly knowledgeService: KnowledgeService,
    private readonly messagesService: MessagesService,
    private readonly checkpointerProvider: MongoCheckpointerProvider,
  ) {}

  getGraph(): CompiledAgentGraph {
    if (this.compiled === undefined) {
      this.compiled = buildAgentGraph({
        chatModel: this.chatModelProvider.getChatModel(),
        embeddings: this.embeddingProvider,
        knowledge: this.knowledgeService,
        messages: this.messagesService,
        checkpointer: this.checkpointerProvider.getSaver(),
      });
    }
    return this.compiled;
  }
}
