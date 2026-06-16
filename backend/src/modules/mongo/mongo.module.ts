import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionRunner } from './transaction.runner';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri:
          process.env.MONGO_URI ?? configService.getOrThrow<string>('MONGO_URI'),
      }),
    }),
  ],
  providers: [TransactionRunner],
  exports: [MongooseModule, TransactionRunner],
})
export class MongoModule {}
