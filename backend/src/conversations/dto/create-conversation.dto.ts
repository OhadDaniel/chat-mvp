import { IsNotEmpty, IsString } from 'class-validator'

export class CreateConversationDto {
  /** The other user — the current user is taken from the JWT, never the body. */
  @IsString()
  @IsNotEmpty()
  participantId!: string
}
