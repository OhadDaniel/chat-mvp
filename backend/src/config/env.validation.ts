import { plainToInstance } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  @MinLength(32, { message: 'JWT_SECRET must be at least 32 characters' })
  JWT_SECRET!: string;

  /** e.g. mongodb://127.0.0.1:27017/chat_mvp?replicaSet=rs0 */
  @IsString()
  @Matches(/^mongodb(\+srv)?:\/\//, {
    message: 'MONGO_URI must be a mongodb:// or mongodb+srv:// connection string',
  })
  MONGO_URI!: string;

  @IsString()
  AWS_REGION!: string;

  @IsString()
  AWS_ACCESS_KEY_ID!: string;

  @IsString()
  AWS_SECRET_ACCESS_KEY!: string;

  /** S3 bucket that stores avatar objects. */
  @IsString()
  AVATAR_BUCKET!: string;

  /** CloudFront base URL the avatars are served from. */
  @IsString()
  @Matches(/^https?:\/\//, {
    message: 'AVATAR_PUBLIC_BASE_URL must be an http(s) URL',
  })
  AVATAR_PUBLIC_BASE_URL!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(65535)
  PORT?: number;

  /** e.g. '1h', '15m' — how long access tokens live */
  @IsOptional()
  @IsString()
  JWT_EXPIRES_IN?: string;

  /** bcrypt work factor — higher = slower = safer */
  @IsOptional()
  @IsInt()
  @Min(4)
  @Max(15)
  BCRYPT_SALT_ROUNDS?: number;
}

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    const messages = errors
      .map((error) => Object.values(error.constraints ?? {}).join(', '))
      .join('; ');
    throw new Error(`Invalid environment configuration: ${messages}`);
  }

  return validated;
}
