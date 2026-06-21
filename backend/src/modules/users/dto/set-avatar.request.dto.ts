import { IsNotEmpty, IsString } from 'class-validator';

export class SetAvatarDto {
  @IsString()
  @IsNotEmpty()
  key!: string;
}
