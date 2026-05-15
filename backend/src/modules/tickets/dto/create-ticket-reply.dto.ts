import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTicketReplyDto {
  @IsString()
  @MinLength(2)
  message!: string;

  @IsOptional()
  @IsBoolean()
  isInternal?: boolean;
}
