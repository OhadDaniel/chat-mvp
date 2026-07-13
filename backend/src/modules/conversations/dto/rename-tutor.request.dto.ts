import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

const MAX_TUTOR_NAME = 60;

export class RenameTutorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_TUTOR_NAME)
  name!: string;
}
