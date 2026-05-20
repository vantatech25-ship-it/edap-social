import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReactionType } from '@prisma/client';

export class ReactDto {
  @IsEnum(ReactionType)
  @IsNotEmpty()
  reactionType: ReactionType;
}
