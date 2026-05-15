import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePlanDto {
  @IsString() name: string;
  @IsString() slug: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() @Min(0) monthlyPrice?: number;
  @IsOptional() @IsNumber() @Min(0) yearlyPrice?: number;
  @IsOptional() @IsInt() @Min(1) userLimit?: number;
  @IsOptional() @IsInt() @Min(1) clientLimit?: number;
  @IsOptional() @IsInt() @Min(1) projectLimit?: number;
  @IsOptional() @IsInt() @Min(0) aiMonthlyLimit?: number;
  @IsOptional() features?: Record<string, unknown>;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
