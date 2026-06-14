/**
 * Injection token for the shared pg connection pool.
 * Lives in its own file so module and service can both import it
 * without importing each other (circular imports leave values
 * undefined at decorator-evaluation time).
 */
export const PG_POOL = 'PG_POOL';
