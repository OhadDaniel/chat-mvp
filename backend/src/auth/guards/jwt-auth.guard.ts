import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * The checkpoint. `@UseGuards(JwtAuthGuard)` on a route/controller
 * means: no valid token, no entry (401). It runs the JwtStrategy;
 * the strategy does the actual verification.
 * Named class (vs AuthGuard('jwt') inline) so call sites read clean.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
