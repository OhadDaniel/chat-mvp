import { AppException } from '../../../common/errors/app.exception';

export class DocumentLimitReachedError extends AppException {
  constructor(limit: number) {
    super(
      409,
      'DOCUMENT_LIMIT_REACHED',
      `This tutor has reached its limit of ${limit} documents`,
    );
  }
}
