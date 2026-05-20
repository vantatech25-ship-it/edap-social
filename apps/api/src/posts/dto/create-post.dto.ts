import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  MinLength,
} from 'class-validator';
import { PostPrivacy } from '@prisma/client';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  content: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mediaUrls?: string[];

  @IsEnum(PostPrivacy)
  @IsOptional()
  privacy?: PostPrivacy;
}
