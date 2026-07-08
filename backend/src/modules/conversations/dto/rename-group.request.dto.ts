import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

const MAX_GROUP_TITLE = 60;

export class RenameGroupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_GROUP_TITLE)
  name!: string;
}
