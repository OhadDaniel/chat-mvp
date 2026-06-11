import { IsBoolean } from 'class-validator'

export class PatchConversationDto {
  @IsBoolean()
  pinned!: boolean
}
