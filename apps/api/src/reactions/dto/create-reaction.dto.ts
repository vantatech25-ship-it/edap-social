import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ReactionEntityType, ReactionType } from '@prisma/client';

export class CreateReactionDto {
  @IsEnum(ReactionEntityType)
  @IsNotEmpty()
  entityType: ReactionEntityType;

  @IsUUID()
  @IsNotEmpty()
  entityId: string;

  @IsEnum(ReactionType)
  @IsNotEmpty()
  reactionType: ReactionType;
}
