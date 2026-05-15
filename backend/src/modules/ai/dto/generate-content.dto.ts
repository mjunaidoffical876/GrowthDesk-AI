import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export const aiToolTypes = [
  'blog_writer',
  'seo_meta',
  'proposal_writer',
  'email_reply',
  'social_post',
] as const;

export type AIToolType = (typeof aiToolTypes)[number];

export class GenerateContentDto {
  @IsString()
  @IsIn(aiToolTypes)
  toolType!: AIToolType;

  @IsString()
  @MinLength(10)
  @MaxLength(4000)
  prompt!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  tone?: string;
}
