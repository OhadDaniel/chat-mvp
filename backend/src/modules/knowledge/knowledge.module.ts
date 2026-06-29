import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from '../mongo/mongo.module';
import {
  KnowledgeChunkDocument,
  KnowledgeChunkSchema,
} from './knowledge.schema';
import { KnowledgeRepository } from './knowledge.repository';
import { KnowledgeService } from './knowledge.service';

@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([
      { name: KnowledgeChunkDocument.name, schema: KnowledgeChunkSchema },
    ]),
  ],
  providers: [KnowledgeService, KnowledgeRepository],
  exports: [KnowledgeService],
})
export class KnowledgeModule {}
