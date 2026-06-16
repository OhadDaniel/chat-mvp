import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from '../mongo/mongo.module';
import { StorageModule } from '../storage/storage.module';
import { ConversationMongo, ConversationSchema } from './conversations.schema';
import { ConversationsRepository } from './conversations.repository';
import { ConversationsService } from './conversations.service';


@Module({
  imports: [
    MongoModule,
    StorageModule,
    MongooseModule.forFeature([
      { name: ConversationMongo.name, schema: ConversationSchema },
    ]),
  ],
  providers: [ConversationsService, ConversationsRepository],
  exports: [ConversationsService], 
})
export class ConversationsModule {}
