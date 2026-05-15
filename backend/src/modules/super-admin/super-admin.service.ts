import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SuperAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [tenants, users, projects, invoices, tickets, aiRequests, plans] = await Promise.all([
      this.prisma.tenant.count({ where: { deletedAt: null } }),
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.project.count({ where: { deletedAt: null } }),
      this.prisma.invoice.count({ where: { deletedAt: null } }),
      this.prisma.supportTicket.count({ where: { deletedAt: null } }),
      this.prisma.aIRequest.count(),
      this.prisma.subscriptionPlan.findMany({ where: { isActive: true } }),
    ]);

    const invoiceTotals = await this.prisma.invoice.aggregate({
      where: { deletedAt: null },
      _sum: { totalAmount: true, paidAmount: true },
    });

    const activeSubscriptions = await this.prisma.tenant.count({
      where: { deletedAt: null, subscriptionStatus: { in: ['active', 'trial'] } },
    });

    const estimatedMrr = plans.reduce((sum, plan) => sum + Number(plan.monthlyPrice || 0), 0);

    return {
      tenants,
      users,
      projects,
      invoices,
      tickets,
      aiRequests,
      activeSubscriptions,
      estimatedMrr,
      totalInvoiceValue: Number(invoiceTotals._sum.totalAmount || 0),
      totalPaidValue: Number(invoiceTotals._sum.paidAmount || 0),
    };
  }

  async getTenants() {
    return this.prisma.tenant.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        companyName: true,
        slug: true,
        email: true,
        subscriptionStatus: true,
        createdAt: true,
        subscriptionPlan: {
          select: { name: true, monthlyPrice: true, userLimit: true, aiMonthlyLimit: true },
        },
        _count: {
          select: { users: true, projects: true, clients: true, invoices: true, aiRequests: true },
        },
      },
    });
  }

  async getAnalytics() {
    const [tenantStatuses, invoiceStatuses, leadStatuses, ticketStatuses, aiByTool] = await Promise.all([
      this.prisma.tenant.groupBy({ by: ['subscriptionStatus'], _count: { _all: true } }),
      this.prisma.invoice.groupBy({ by: ['status'], where: { deletedAt: null }, _count: { _all: true }, _sum: { totalAmount: true } }),
      this.prisma.lead.groupBy({ by: ['status'], where: { deletedAt: null }, _count: { _all: true } }),
      this.prisma.supportTicket.groupBy({ by: ['status'], where: { deletedAt: null }, _count: { _all: true } }),
      this.prisma.aIRequest.groupBy({ by: ['toolType'], _count: { _all: true }, _sum: { inputTokens: true, outputTokens: true, estimatedCost: true } }),
    ]);

    return { tenantStatuses, invoiceStatuses, leadStatuses, ticketStatuses, aiByTool };
  }

  async getPlans() {
    return this.prisma.subscriptionPlan.findMany({ orderBy: { monthlyPrice: 'asc' } });
  }
}
