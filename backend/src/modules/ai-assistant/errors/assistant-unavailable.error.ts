import { AppException } from '../../../common/errors/app.exception';

export class AssistantUnavailableError extends AppException {
  constructor() {
    super(503, 'ASSISTANT_UNAVAILABLE', 'The assistant is not configured');
  }
}
