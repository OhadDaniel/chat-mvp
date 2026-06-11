import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

/**
 * Login deliberately does NOT enforce password length rules —
 * any wrong password should fail the same way (401), without
 * hinting at the password policy.
 */
export class LoginDto {
  @IsEmail()
  email!: string

  @IsString()
  @IsNotEmpty()
  password!: string
}
