import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import type { User } from '../../users/entities/user.entity'

/**
 * `@CurrentUser()` hands the controller the User that JwtStrategy
 * loaded — typed, no `req.user` repetition, no `any`.
 * Only meaningful on routes protected by JwtAuthGuard.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest<{ user: User }>()
    return request.user
  },
)
