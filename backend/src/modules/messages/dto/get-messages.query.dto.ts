import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetMessagesQueryDto {
  /** id of the oldest message already loaded; next page = older ones */
  @IsOptional()
  @IsString()
  cursor?: string;

  /** query params arrive as strings — @Type converts before @IsInt checks */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
