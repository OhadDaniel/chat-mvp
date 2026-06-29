import 'reflect-metadata'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import * as dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import type { AnyBulkWriteOperation, Collection, Document } from 'mongodb'
import { ConfigService } from '@nestjs/config'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import type { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { OpenAIEmbeddingProvider } from '../src/modules/embedding/openai-embedding.provider'
import { OpenAiChatModelProvider } from '../src/modules/chat-model/openai-chat-model.provider'
import { chunkText } from '../src/modules/ingest-document-orchestrator/chunk-text'
import {
  TUTOR_SYSTEM_PROMPT,
  buildContextBlock,
  buildUserPrompt,
} from '../src/modules/stream-tutor-reply-orchestrator/tutor.prompt'
import {
  DEFAULT_TOP_K,
  EMBEDDING_PATH,
  KNOWLEDGE_COLLECTION,
  KNOWLEDGE_VECTOR_INDEX,
  VECTOR_NUM_CANDIDATES,
} from '../src/modules/knowledge/knowledge.constants'
import type { RetrievedChunk } from '../src/modules/knowledge/knowledge.types'
import { recallAtK, answerCovers } from './rag/metrics'

dotenv.config({ quiet: true })

const USER_ID = 'eval-user'
const TUTOR_ID = 'eval-tutor'
const CORPUS_DIR = join(__dirname, 'rag-corpus')
const CASES_PATH = join(__dirname, 'rag.eval.json')
const INDEX_LAG_RETRIES = 12
const INDEX_LAG_DELAY_MS = 2500
const JUDGE_PROMPT =
  'You grade a tutor answer for correctness and grounding. Reply with only a single integer from 1 to 5, where 5 is fully correct and grounded and 1 is wrong.'

type EvalCase = {
  id: string
  question: string
  expectedSource: string
  mustInclude: string[]
}

type ChunkDoc = {
  _id: string
  userId: string
  tutorId: string
  docId: string
  source: string
  chunkIndex: number
  text: string
  embedding: number[]
}

type RetrievedLean = {
  _id: string
  docId: string
  source: string
  chunkIndex: number
  text: string
  score: number
}

type CaseResult = {
  id: string
  recall: number
  covered: boolean | null
  judge: number | null
}

function envConfig(): ConfigService {
  return {
    get: (key: string): string | undefined => process.env[key],
  } as unknown as ConfigService
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function ingestCorpus(
  collection: Collection<ChunkDoc>,
  provider: OpenAIEmbeddingProvider,
): Promise<void> {
  const sources = readdirSync(CORPUS_DIR).filter(name => name.endsWith('.md'))
  const operations: AnyBulkWriteOperation<ChunkDoc>[] = []

  for (const source of sources) {
    const text = readFileSync(join(CORPUS_DIR, source), 'utf8')
    const pieces = await chunkText(text)
    const embeddings = await provider.embed(pieces.map(piece => piece.text))
    pieces.forEach((piece, index) => {
      operations.push({
        updateOne: {
          filter: { _id: `${source}:${piece.chunkIndex}` },
          update: {
            $set: {
              userId: USER_ID,
              tutorId: TUTOR_ID,
              docId: source,
              source,
              chunkIndex: piece.chunkIndex,
              text: piece.text,
              embedding: embeddings[index],
            },
          },
          upsert: true,
        },
      })
    })
  }

  if (operations.length > 0) {
    await collection.bulkWrite(operations)
  }
}

async function retrieve(
  collection: Collection<ChunkDoc>,
  queryVector: number[],
  k: number,
): Promise<RetrievedChunk[]> {
  const pipeline: Document[] = [
    {
      $vectorSearch: {
        index: KNOWLEDGE_VECTOR_INDEX,
        path: EMBEDDING_PATH,
        queryVector,
        filter: { userId: USER_ID, tutorId: TUTOR_ID },
        numCandidates: VECTOR_NUM_CANDIDATES,
        limit: k,
      },
    },
    {
      $project: {
        _id: 1,
        docId: 1,
        source: 1,
        chunkIndex: 1,
        text: 1,
        score: { $meta: 'vectorSearchScore' },
      },
    },
  ]
  const rows = await collection.aggregate<RetrievedLean>(pipeline).toArray()
  return rows.map(row => ({
    id: row._id,
    docId: row.docId,
    source: row.source,
    chunkIndex: row.chunkIndex,
    text: row.text,
    score: row.score,
  }))
}

async function answerQuestion(
  model: BaseChatModel,
  chunks: RetrievedChunk[],
  question: string,
): Promise<string> {
  const context = buildContextBlock(chunks)
  return model
    .pipe(new StringOutputParser())
    .invoke([
      new SystemMessage(TUTOR_SYSTEM_PROMPT),
      new HumanMessage(buildUserPrompt(context, question)),
    ])
}

async function judgeAnswer(
  model: BaseChatModel,
  question: string,
  answer: string,
): Promise<number> {
  const raw = await model
    .pipe(new StringOutputParser())
    .invoke([
      new SystemMessage(JUDGE_PROMPT),
      new HumanMessage(`Question: ${question}\n\nAnswer: ${answer}`),
    ])
  const match = raw.match(/[1-5]/)
  return match ? Number(match[0]) : 0
}

async function waitForIndex(
  collection: Collection<ChunkDoc>,
  provider: OpenAIEmbeddingProvider,
): Promise<void> {
  const [probe] = await provider.embed(['binary search'])
  for (let attempt = 0; attempt < INDEX_LAG_RETRIES; attempt++) {
    const rows = await retrieve(collection, probe, DEFAULT_TOP_K)
    if (rows.length > 0) {
      return
    }
    await delay(INDEX_LAG_DELAY_MS)
  }
}

function report(
  results: CaseResult[],
  useJudge: boolean,
  retrievalOnly: boolean,
): void {
  if (retrievalOnly) {
    console.log('| id | recall@5 |')
    console.log('|---|---|')
    for (const result of results) {
      console.log(`| ${result.id} | ${result.recall.toFixed(2)} |`)
    }
  } else {
    console.log(useJudge ? '| id | recall@5 | answer | judge |' : '| id | recall@5 | answer |')
    console.log(useJudge ? '|---|---|---|---|' : '|---|---|---|')
    for (const result of results) {
      const verdict = result.covered ? 'pass' : 'fail'
      console.log(
        useJudge
          ? `| ${result.id} | ${result.recall.toFixed(2)} | ${verdict} | ${result.judge}/5 |`
          : `| ${result.id} | ${result.recall.toFixed(2)} | ${verdict} |`,
      )
    }
  }

  const total = results.length
  const recall = results.reduce((sum, r) => sum + r.recall, 0) / total
  const hits = results.filter(r => r.recall > 0).length

  console.log('')
  console.log(
    `Retrieval recall@${DEFAULT_TOP_K}: ${recall.toFixed(2)} (${hits}/${total} cases hit)`,
  )
  if (!retrievalOnly) {
    const passes = results.filter(r => r.covered === true).length
    console.log(`Answer pass: ${(passes / total).toFixed(2)} (${passes}/${total})`)
    if (useJudge) {
      const avg = results.reduce((sum, r) => sum + (r.judge ?? 0), 0) / total
      console.log(`LLM-judge average: ${avg.toFixed(2)}/5`)
    }
  }
}

async function main(): Promise<void> {
  const uri = process.env.MONGO_URI
  if (!uri) {
    throw new Error('MONGO_URI is required to run the RAG eval')
  }

  const useJudge = process.env.USE_LLM_JUDGE === 'true'
  const retrievalOnly = process.env.EVAL_RETRIEVAL_ONLY === 'true'
  const cases = JSON.parse(readFileSync(CASES_PATH, 'utf8')) as EvalCase[]
  const provider = new OpenAIEmbeddingProvider(envConfig())
  const model = new OpenAiChatModelProvider(envConfig()).getChatModel()

  const client = new MongoClient(uri)
  await client.connect()
  const collection = client.db().collection<ChunkDoc>(KNOWLEDGE_COLLECTION)

  try {
    console.error('Ingesting eval corpus…')
    await ingestCorpus(collection, provider)
    await waitForIndex(collection, provider)
    console.error(`Index ready — scoring ${cases.length} cases…`)

    const results: CaseResult[] = []
    for (const [index, evalCase] of cases.entries()) {
      console.error(`[${index + 1}/${cases.length}] ${evalCase.id}`)
      const [queryVector] = await provider.embed([evalCase.question])
      const chunks = await retrieve(collection, queryVector, DEFAULT_TOP_K)
      const recall = recallAtK(
        [evalCase.expectedSource],
        chunks.map(chunk => chunk.source),
      )
      const answer = retrievalOnly
        ? ''
        : await answerQuestion(model, chunks, evalCase.question)
      const covered = retrievalOnly
        ? null
        : answerCovers(answer, evalCase.mustInclude)
      const judge =
        !retrievalOnly && useJudge
          ? await judgeAnswer(model, evalCase.question, answer)
          : null
      results.push({ id: evalCase.id, recall, covered, judge })
    }

    report(results, useJudge && !retrievalOnly, retrievalOnly)
  } finally {
    await collection.deleteMany({ userId: USER_ID, tutorId: TUTOR_ID })
    await client.close()
  }
}

main().catch(error => {
  console.error('Eval failed', error)
  process.exit(1)
})
