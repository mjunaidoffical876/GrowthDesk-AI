import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SuperAdminService } from './super-admin.service';

@UseGuards(JwtAuthGuard)
@Controller('super-admin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.superAdminService.getDashboard();
  }

  @Get('tenants')
  tenants() {
    return this.superAdminService.getTenants();
  }

  @Get('analytics')
  analytics() {
    return this.superAdminService.getAnalytics();
  }

  @Get('plans')
  plans() {
    return this.superAdminService.getPlans();
  }
}
