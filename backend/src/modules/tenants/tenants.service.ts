import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  findMe(tenantId: string) {
    return this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        companyName: true,
        slug: true,
        email: true,
        phone: true,
        logoUrl: true,
        website: true,
        subscriptionStatus: true,
        trialEndsAt: true,
        createdAt: true,
      },
    });
  }

  updateMe(tenantId: string, dto: UpdateTenantDto) {
    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: dto,
      select: {
        id: true,
        companyName: true,
        slug: true,
        email: true,
        phone: true,
        logoUrl: true,
        website: true,
        subscriptionStatus: true,
        updatedAt: true,
      },
    });
  }
}
