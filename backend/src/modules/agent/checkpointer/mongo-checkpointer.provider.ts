import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoDBSaver } from '@langchain/langgraph-checkpoint-mongodb';
import { MongoClient } from 'mongodb';
import {
  CHECKPOINT_COLLECTION,
  CHECKPOINT_WRITES_COLLECTION,
} from '../agent.constants';

@Injectable()
export class MongoCheckpointerProvider
  implements OnModuleInit, OnModuleDestroy
{
  private readonly client: MongoClient;
  private readonly saver: MongoDBSaver;

  constructor(configService: ConfigService) {
    const uri =
      process.env.MONGO_URI ?? configService.getOrThrow<string>('MONGO_URI');
    this.client = new MongoClient(uri);
    this.saver = new MongoDBSaver({
      client: this.client,
      checkpointCollectionName: CHECKPOINT_COLLECTION,
      checkpointWritesCollectionName: CHECKPOINT_WRITES_COLLECTION,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.client.connect();
    const setupErrors = await this.saver.setup();
    if (setupErrors.length > 0) {
      throw setupErrors[0];
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }

  getSaver(): MongoDBSaver {
    return this.saver;
  }
}
