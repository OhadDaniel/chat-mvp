import { AppException } from '../../../common/errors/app.exception';

export class DocumentNotFoundError extends AppException {
  constructor() {
    super(404, 'DOCUMENT_NOT_FOUND', 'Document not found');
  }
}
