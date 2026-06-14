/**
 * Type guard for Postgres unique-constraint violations (SQLSTATE 23505).
 * Used as a race-proof backstop: services pre-check duplicates for a
 * friendly error, but if two requests slip through simultaneously the
 * DB constraint still fires — and we map it to the same 409.
 */
export function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === '23505'
  );
}
