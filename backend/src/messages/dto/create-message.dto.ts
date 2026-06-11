import { IsString, MaxLength, MinLength } from 'class-validator'

export class CreateMessageDto {
  @IsString()
  @MinLength(1, { message: 'content is required' })
  @MaxLength(2000, { message: 'content is too long' })
  content!: string
}
