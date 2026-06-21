import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from '../mongo/mongo.module';
import { ConversationDocument, ConversationSchema } from './conversations.schema';
import { ConversationsRepository } from './conversations.repository';
import { ConversationsService } from './conversations.service';


@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([
      { name: ConversationDocument.name, schema: ConversationSchema },
    ]),
  ],
  providers: [ConversationsService, ConversationsRepository],
  exports: [ConversationsService], 
})
export class ConversationsModule {}
