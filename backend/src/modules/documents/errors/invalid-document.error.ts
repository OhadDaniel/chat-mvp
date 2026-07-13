import { AppException } from '../../../common/errors/app.exception';

export class InvalidDocumentError extends AppException {
  constructor(message: string) {
    super(400, 'INVALID_DOCUMENT', message);
  }
}
