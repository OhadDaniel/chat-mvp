import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Client, Pool } from 'pg';
import { AppModule } from '../../src/app.module';
import { configureApp } from '../../src/app.setup';
import { PG_POOL } from '../../src/database/database.constants';

/**
 * Boots the REAL application — AppModule, guards, pipes, filter,
 * Postgres, seeds — against a fresh database created inside the
 * embedded Postgres that global-setup started.
 *
 * Each suite gets its own database (full isolation); the suite's pool
 * is injected by overriding the PG_POOL provider — the same seam the
 * production factory uses.
 */
export async function createTestApp(): Promise<INestApplication> {
  const port = Number(process.env.TEST_PG_PORT ?? '5439');
  const user = process.env.TEST_PG_USER ?? 'chat_test';
  const password = process.env.TEST_PG_PASSWORD ?? 'chat_test';
  const dbName = `test_${randomUUID().replaceAll('-', '')}`;

  const admin = new Client({
    host: '127.0.0.1',
    port,
    user,
    password,
    database: 'postgres',
  });
  await admin.connect();
  await admin.query(`CREATE DATABASE ${dbName}`);
  await admin.end();

  const pool = new Pool({
    host: '127.0.0.1',
    port,
    user,
    password,
    database: dbName,
  });

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PG_POOL)
    .useValue(pool)
    .compile();

  const app = moduleRef.createNestApplication({ logger: false });
  configureApp(app); // the EXACT production pipeline
  await app.init(); // applies schema + seeds (empty DB)

  return app;
}
