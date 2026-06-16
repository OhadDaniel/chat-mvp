import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { MeOrchestrator } from './me.orchestrator';

@Module({
  imports: [StorageModule],
  providers: [MeOrchestrator],
  exports: [MeOrchestrator],
})
export class MeModule {}
