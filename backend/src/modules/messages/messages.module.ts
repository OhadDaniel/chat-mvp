import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from '../mongo/mongo.module';
import { StorageModule } from '../storage/storage.module';
import { MessageMongo, MessageSchema } from './messages.schema';
import { MessagesRepository } from './messages.repository';
import { MessagesService } from './messages.service';


@Module({
  imports: [
    MongoModule,
    StorageModule,
    MongooseModule.forFeature([
      { name: MessageMongo.name, schema: MessageSchema },
    ]),
  ],
  providers: [MessagesService, MessagesRepository],
  exports: [MessagesService],
})
export class MessagesModule {}
