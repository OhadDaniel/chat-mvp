import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { Pool } from 'pg'
import { PG_POOL } from './database.constants'
import { SCHEMA_SQL } from './schema'

/**
 * Lifecycle keeper for the database:
 * - on boot: applies the idempotent schema (fail-fast — if the DB is
 *   unreachable or the DDL is broken, the app refuses to start)
 * - on shutdown: closes the pool so connections aren't leaked
 */
@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name)

  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async onModuleInit(): Promise<void> {
    await this.pool.query(SCHEMA_SQL)
    this.logger.log('Database schema ensured')
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end()
  }
}
