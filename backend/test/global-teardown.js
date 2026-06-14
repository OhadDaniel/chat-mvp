/** Stops the embedded Postgres started by global-setup.js. */
module.exports = async function globalTeardown() {
  const pg = globalThis.__EMBEDDED_PG__;
  if (pg) {
    await pg.stop();
  }
};
