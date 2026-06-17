import { Module } from '@nestjs/common';
import { MeOrchestrator } from './me.orchestrator';

@Module({
  providers: [MeOrchestrator],
  exports: [MeOrchestrator],
})
export class MeModule {}
