import { AppException } from '../../../common/errors/app.exception';

export class InvalidCredentialsError extends AppException {
  constructor() {
    super(401, 'INVALID_CREDENTIALS', 'Invalid credentials');
  }
}
