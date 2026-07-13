import { AppException } from '../../../common/errors/app.exception';

export class AgentConfigError extends AppException {
  constructor() {
    super(
      500,
      'AGENT_CONFIG_INVALID',
      'Agent runtime context is missing or invalid',
    );
  }
}
