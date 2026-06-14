import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { GroupPrivacy } from '@prisma/client';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  coverUrl?: string;

  @IsEnum(GroupPrivacy)
  @IsOptional()
  privacy?: GroupPrivacy;
}
