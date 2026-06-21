import { AppException } from '../../../common/errors/app.exception';

/**
 * A token passed signature + expiry checks, but the user it points at no
 * longer exists (e.g. deleted after the token was issued) — treat as 401.
 */
export class SessionUserNotFoundError extends AppException {
  constructor() {
    super(401, 'UNAUTHORIZED', 'User no longer exists');
  }
}
