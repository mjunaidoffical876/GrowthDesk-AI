import { IsIn, IsString } from 'class-validator';

export class ChangePlanDto {
  @IsString() planId: string;
  @IsIn(['monthly', 'yearly']) billingCycle: 'monthly' | 'yearly';
}
