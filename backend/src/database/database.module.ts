import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Pool } from 'pg'
import { PG_POOL } from './database.constants'
import { DatabaseService } from './database.service'

/**
 * Owns the Postgres connection. Feature modules import this module
 * and inject PG_POOL into their repositories — nothing else about
 * the database leaks out.
 */
@Module({
  providers: [
    {
      provide: PG_POOL,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Pool =>
        new Pool({
          connectionString: configService.getOrThrow<string>('DATABASE_URL'),
        }),
    },
    DatabaseService,
  ],
  exports: [PG_POOL],
})
export class DatabaseModule {}
