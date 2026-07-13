import { readFileSync } from 'node:fs';
import { config as loadEnv } from 'dotenv';
import { MongoClient } from 'mongodb';
import type { Collection, Db } from 'mongodb';
import {
  KNOWLEDGE_COLLECTION,
  KNOWLEDGE_VECTOR_INDEX,
} from '../src/modules/knowledge/knowledge.constants';
import {
  INDEX_CONFIG_PATH,
  NAMESPACE_EXISTS_CODE,
} from './create-knowledge-index.constants';
import type { VectorIndexDefinition } from './create-knowledge-index.types';

loadEnv();

type SearchIndexInfo = { name?: string };

function readIndexDefinition(): VectorIndexDefinition {
  return JSON.parse(
    readFileSync(INDEX_CONFIG_PATH, 'utf8'),
  ) as VectorIndexDefinition;
}

function hasErrorCode(error: unknown, code: number): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { code?: unknown }).code === code
  );
}

async function ensureCollection(db: Db, name: string): Promise<void> {
  try {
    await db.createCollection(name);
  } catch (error) {
    if (!hasErrorCode(error, NAMESPACE_EXISTS_CODE)) {
      throw error;
    }
  }
}

async function indexExists(
  collection: Collection,
  name: string,
): Promise<boolean> {
  const indexes = (await collection
    .listSearchIndexes()
    .toArray()) as SearchIndexInfo[];
  return indexes.some((index) => index.name === name);
}

async function main(): Promise<void> {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is required to provision the Atlas vector index');
  }

  const definition = readIndexDefinition();
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    await ensureCollection(db, KNOWLEDGE_COLLECTION);
    const collection = db.collection(KNOWLEDGE_COLLECTION);

    if (await indexExists(collection, KNOWLEDGE_VECTOR_INDEX)) {
      console.log(
        `Vector index "${KNOWLEDGE_VECTOR_INDEX}" already exists — nothing to do`,
      );
      return;
    }

    await collection.createSearchIndexes([
      { name: KNOWLEDGE_VECTOR_INDEX, type: 'vectorSearch', definition },
    ]);
    console.log(
      `Created vector index "${KNOWLEDGE_VECTOR_INDEX}" on ${db.databaseName}.${KNOWLEDGE_COLLECTION}`,
    );
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error('Failed to provision the Atlas vector index', error);
  process.exit(1);
});
