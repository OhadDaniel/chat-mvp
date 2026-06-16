import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/modules/app/app.module';
import { configureApp } from '../../src/modules/app/app.setup';

/**
 * Boots the REAL application — AppModule, guards, pipes, filter,
 * Mongoose, seeds — against a fresh database inside the in-memory
 * Mongo replica set that global-setup started.
 *
 * Each suite gets its own database (full isolation) by injecting a
 * unique db name into MONGO_URI before AppModule reads it.
 */
export async function createTestApp(): Promise<INestApplication> {
  const base = process.env.MONGO_URI as string; // mongodb://host:port/<db?>?replicaSet=rs
  const dbName = `test_${randomUUID().replace(/-/g, '')}`;
  // drop any db name a previous suite (sharing this worker) left behind, then
  // insert a fresh unique one before the query string — full per-suite isolation
  const uri = base.replace(/\/[^/?]*(\?|$)/, `/${dbName}$1`);
  process.env.MONGO_URI = uri;

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication({ logger: false });
  configureApp(app); // the EXACT production pipeline
  await app.init();

  return app;
}
