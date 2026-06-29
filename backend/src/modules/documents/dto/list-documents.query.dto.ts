import { IsNotEmpty, IsString } from 'class-validator';

export class ListDocumentsQueryDto {
  @IsString()
  @IsNotEmpty()
  tutorId!: string;
}
