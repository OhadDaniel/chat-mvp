import { AppException } from '../../../common/errors/app.exception';

export class InvalidParticipantError extends AppException {
  constructor() {
    super(
      400,
      'INVALID_PARTICIPANT',
      'Cannot start a conversation with yourself',
    );
  }
}
