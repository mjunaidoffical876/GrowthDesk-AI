import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateTenantDto {
  @IsString()
  @IsOptional()
  companyName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;
}
