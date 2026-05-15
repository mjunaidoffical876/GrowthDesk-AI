import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTicketDto {
  @IsOptional()
  @IsString()
  clientId?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(160)
  subject!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  assignedToId?: string;
}
