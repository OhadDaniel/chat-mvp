import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppException } from '../../common/errors/app.exception';
import type { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import type { JwtPayload } from '../auth.types';

/**
 * The one place that knows HOW a token is verified:
 * - read from `Authorization: Bearer <token>`
 * - signature must match JWT_SECRET, algorithm pinned to HS256
 * - expired tokens rejected (ignoreExpiration: false)
 * Whatever validate() returns becomes `request.user`.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      algorithms: ['HS256'],
    });
  }

  /**
   * Runs only AFTER the signature + expiry checks passed.
   * We load the real user so controllers get a full, typed User —
   * and so a deleted user with a still-valid token gets 401.
   */
  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new AppException(401, 'UNAUTHORIZED', 'User no longer exists');
    }

    return user;
  }
}
