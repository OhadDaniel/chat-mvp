import { AppException } from '../../../common/errors/app.exception';

export class EmailAlreadyExistsError extends AppException {
  constructor() {
    super(
      409,
      'EMAIL_ALREADY_EXISTS',
      'A user with this email already exists',
    );
  }
}
