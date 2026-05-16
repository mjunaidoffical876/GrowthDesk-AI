import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ActivityLogsService {
  constructor(private prisma: PrismaService) {}

  async record(data: { tenantId: string; userId?: string; action: string; module: string; meta?: any; ipAddress?: string }) {
    return this.prisma.activityLog.create({
      data: {
        tenantId: data.tenantId,
        userId: data.userId,
        action: data.action,
        module: data.module,
        meta: data.meta ?? {},
        ipAddress: data.ipAddress,
      },
    });
  }

  async list(tenantId: string) {
    return this.prisma.activityLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
