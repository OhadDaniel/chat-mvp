/** All SQL for the users store — named, in one place, data-free. */

const USER_COLUMNS = `id, email, name, avatar_initials, password_hash`;

export const FIND_USER_BY_ID = `
  SELECT ${USER_COLUMNS}
    FROM users
   WHERE id = $1`;

export const FIND_USER_BY_EMAIL = `
  SELECT ${USER_COLUMNS}
    FROM users
   WHERE email = $1`;

export const INSERT_USER = `
  INSERT INTO users (id, email, name, avatar_initials, password_hash)
  VALUES ($1, $2, $3, $4, $5)`;

export const COUNT_USERS = `SELECT count(*) AS count FROM users`;
