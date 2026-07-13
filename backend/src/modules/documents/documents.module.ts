import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from '../mongo/mongo.module';
import { DocumentRecord, DocumentRecordSchema } from './documents.schema';
import { DocumentsRepository } from './documents.repository';
import { DocumentsService } from './documents.service';

@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([
      { name: DocumentRecord.name, schema: DocumentRecordSchema },
    ]),
  ],
  providers: [DocumentsService, DocumentsRepository],
  exports: [DocumentsService],
})
export class DocumentsModule {}
