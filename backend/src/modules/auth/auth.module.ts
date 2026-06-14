import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, type JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

/**
 * Auth infrastructure module: token issuance (AuthService) plus the
 * JWT verification pipeline (PassportModule + JwtStrategy) used by the
 * guard. No controller — endpoints are wired by the auth orchestrators.
 * UsersModule is imported for JwtStrategy.validate (load the live user
 * behind a token); that's the guard pipeline, not endpoint orchestration.
 */
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          // env vars are plain strings; expiresIn expects the ms-style
          // duration type ('1h', '15m', ...) — assert at the boundary
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ??
            '1h') as JwtSignOptions['expiresIn'],
          algorithm: 'HS256',
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // orchestrators inject the token issuer
})
export class AuthModule {}
