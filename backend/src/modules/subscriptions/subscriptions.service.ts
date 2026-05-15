import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { ChangePlanDto } from './dto/change-plan.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPlans(includeInactive = false) {
    await this.ensureDefaultPlans();
    return this.prisma.subscriptionPlan.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { monthlyPrice: 'asc' },
    });
  }

  private async ensureDefaultPlans() {
    const count = await this.prisma.subscriptionPlan.count();
    if (count > 0) return;

    await this.prisma.subscriptionPlan.createMany({
      data: [
        {
          name: 'Starter',
          slug: 'starter',
          description: 'For freelancers and small teams starting their operations system.',
          monthlyPrice: 49,
          yearlyPrice: 490,
          userLimit: 3,
          clientLimit: 50,
          projectLimit: 20,
          aiMonthlyLimit: 100,
          features: ['CRM', 'Projects', 'Invoices', 'AI Tools'],
        },
        {
          name: 'Growth',
          slug: 'growth',
          description: 'Best for agencies managing clients, projects, invoices, and AI workflows.',
          monthlyPrice: 99,
          yearlyPrice: 990,
          userLimit: 10,
          clientLimit: 250,
          projectLimit: 100,
          aiMonthlyLimit: 500,
          features: ['Everything in Starter', 'Team Management', 'Tickets', 'Advanced Usage'],
        },
        {
          name: 'Scale',
          slug: 'scale',
          description: 'For growing companies needing higher limits and operational scale.',
          monthlyPrice: 199,
          yearlyPrice: 1990,
          userLimit: 30,
          clientLimit: 1000,
          projectLimit: 500,
          aiMonthlyLimit: 2000,
          features: ['Everything in Growth', 'Priority Support', 'White-label Foundation'],
        },
      ],
    });
  }

  async createPlan(dto: CreatePlanDto) {
    return this.prisma.subscriptionPlan.create({ data: dto as any });
  }

  async updatePlan(id: string, dto: UpdatePlanDto) {
    return this.prisma.subscriptionPlan.update({ where: { id }, data: dto as any });
  }

  async getTenantSubscription(tenantId: string) {
    const tenant = await this.prisma.tenant.findFirst({
      where: { id: tenantId, deletedAt: null },
      include: { subscriptionPlan: true },
    });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const [users, clients, projects, aiRequestsThisMonth, activeSubscription] = await Promise.all([
      this.prisma.user.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.client.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.project.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.aIRequest.count({
        where: {
          tenantId,
          createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        },
      }),
      this.prisma.subscription.findFirst({
        where: { tenantId },
        include: { plan: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const plan = tenant.subscriptionPlan || activeSubscription?.plan || null;
    return {
      tenant: {
        id: tenant.id,
        companyName: tenant.companyName,
        subscriptionStatus: tenant.subscriptionStatus,
        trialEndsAt: tenant.trialEndsAt,
      },
      plan,
      activeSubscription,
      usage: {
        users,
        clients,
        projects,
        aiRequestsThisMonth,
      },
      limits: plan
        ? {
            userLimit: plan.userLimit,
            clientLimit: plan.clientLimit,
            projectLimit: plan.projectLimit,
            aiMonthlyLimit: plan.aiMonthlyLimit,
          }
        : null,
    };
  }

  async changeTenantPlan(tenantId: string, dto: ChangePlanDto) {
    const plan = await this.prisma.subscriptionPlan.findFirst({ where: { id: dto.planId, isActive: true } });
    if (!plan) throw new BadRequestException('Selected plan is not available');

    const now = new Date();
    const periodEnd = new Date(now);
    if (dto.billingCycle === 'yearly') periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    else periodEnd.setMonth(periodEnd.getMonth() + 1);

    return this.prisma.$transaction(async (tx) => {
      await tx.tenant.update({
        where: { id: tenantId },
        data: { subscriptionPlanId: plan.id, subscriptionStatus: 'active' },
      });

      return tx.subscription.create({
        data: {
          tenantId,
          planId: plan.id,
          status: 'active',
          billingCycle: dto.billingCycle,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          provider: 'manual',
        },
        include: { plan: true },
      });
    });
  }
}
