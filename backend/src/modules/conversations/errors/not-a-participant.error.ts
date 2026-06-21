import { AppException } from '../../../common/errors/app.exception';

export class NotAParticipantError extends AppException {
  constructor() {
    super(
      403,
      'NOT_A_PARTICIPANT',
      'You are not a participant of this conversation',
    );
  }
}
