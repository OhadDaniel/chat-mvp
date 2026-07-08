import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { CONVERSATION_TYPES } from '../conversations.schema';
import type { ConversationType } from '../conversations.schema';

const MAX_GROUP_TITLE = 60;
const MAX_ADDED_MEMBERS = 30;

export class CreateConversationDto {
  @IsIn(CONVERSATION_TYPES)
  type!: ConversationType;

  @ValidateIf((dto: CreateConversationDto) => dto.type === 'direct')
  @IsString()
  @IsNotEmpty()
  participantId?: string;

  @ValidateIf((dto: CreateConversationDto) => dto.type === 'group')
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_GROUP_TITLE)
  name?: string;

  @ValidateIf((dto: CreateConversationDto) => dto.type === 'group')
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  @ArrayMaxSize(MAX_ADDED_MEMBERS)
  participantIds?: string[];
}
