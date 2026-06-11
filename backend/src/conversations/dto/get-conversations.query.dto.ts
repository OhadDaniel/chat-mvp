import { IsOptional, IsString, MaxLength } from 'class-validator'

export class GetConversationsQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  search?: string
}
