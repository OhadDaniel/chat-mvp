import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from '../mongo/mongo.module';
import { MessageDocument, MessageSchema } from './messages.schema';
import { MessagesRepository } from './messages.repository';
import { MessagesService } from './messages.service';


@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([
      { name: MessageDocument.name, schema: MessageSchema },
    ]),
  ],
  providers: [MessagesService, MessagesRepository],
  exports: [MessagesService],
})
export class MessagesModule {}
