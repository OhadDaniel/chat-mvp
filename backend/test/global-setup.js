/**
 * Starts ONE embedded Postgres for the whole integration/e2e run.
 * Each test suite then creates its own database inside it (isolation
 * without paying the ~5s server boot per suite).
 * Plain JS on purpose: jest global hooks run outside ts-jest.
 */
const { mkdtempSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
// the package ships an ESM default export; unwrap it under CommonJS
const EmbeddedPostgres =
  require('embedded-postgres').default ?? require('embedded-postgres');

const PORT = 5439;

module.exports = async function globalSetup() {
  const pg = new EmbeddedPostgres({
    databaseDir: mkdtempSync(join(tmpdir(), 'chat-mvp-test-pg-')),
    user: 'chat_test',
    password: 'chat_test',
    port: PORT,
    persistent: false, // wipe the data dir on stop
  });

  await pg.initialise();
  await pg.start();

  // handed to global-teardown.js (same process)
  globalThis.__EMBEDDED_PG__ = pg;
  // handed to the test workers (inherited environment)
  process.env.TEST_PG_PORT = String(PORT);
  process.env.TEST_PG_USER = 'chat_test';
  process.env.TEST_PG_PASSWORD = 'chat_test';
};
