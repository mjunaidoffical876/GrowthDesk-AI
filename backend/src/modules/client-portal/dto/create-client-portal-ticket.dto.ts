import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateClientPortalTicketDto {
  @IsString()
  @MinLength(3)
  subject!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high', 'urgent'])
  priority?: string;
}
