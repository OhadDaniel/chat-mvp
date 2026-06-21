import { AppException } from '../../../common/errors/app.exception';

export class NotGroupOwnerError extends AppException {
  constructor() {
    super(403, 'NOT_GROUP_OWNER', 'Only the group creator can edit it');
  }
}
