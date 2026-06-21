import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

const MAX_GROUP_TITLE = 60;
const MAX_ADDED_MEMBERS = 30;

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_GROUP_TITLE)
  name!: string;

  /**
   * The others to add (the creator is taken from the JWT, never the body).
   * May be empty — that's a group of just you. Capped, and ids must be distinct.
   */
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  @ArrayMaxSize(MAX_ADDED_MEMBERS)
  participantIds!: string[];
}
