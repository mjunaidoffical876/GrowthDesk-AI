import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClientPortalTicketDto } from './dto/create-client-portal-ticket.dto';

@Injectable()
export class ClientPortalService {
  constructor(private readonly prisma: PrismaService) {}

  private async getClientByUser(tenantId: string, email: string) {
    const client = await this.prisma.client.findFirst({
      where: {
        tenantId,
        deletedAt: null,
        email,
      },
    });

    if (!client) {
      throw new ForbiddenException('No client portal profile is linked with this user email.');
    }

    return client;
  }

  async getOverview(tenantId: string, email: string) {
    const client = await this.getClientByUser(tenantId, email);

    const [projects, invoices, tickets] = await Promise.all([
      this.prisma.project.count({ where: { tenantId, clientId: client.id, deletedAt: null } }),
      this.prisma.invoice.count({ where: { tenantId, clientId: client.id, deletedAt: null } }),
      this.prisma.supportTicket.count({ where: { tenantId, clientId: client.id, deletedAt: null } }),
    ]);

    return {
      client,
      counts: { projects, invoices, tickets },
    };
  }

  async getProjects(tenantId: string, email: string) {
    const client = await this.getClientByUser(tenantId, email);

    return this.prisma.project.findMany({
      where: { tenantId, clientId: client.id, deletedAt: null },
      include: {
        tasks: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getInvoices(tenantId: string, email: string) {
    const client = await this.getClientByUser(tenantId, email);

    return this.prisma.invoice.findMany({
      where: { tenantId, clientId: client.id, deletedAt: null },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTickets(tenantId: string, email: string) {
    const client = await this.getClientByUser(tenantId, email);

    return this.prisma.supportTicket.findMany({
      where: { tenantId, clientId: client.id, deletedAt: null },
      include: {
        replies: {
          where: { isInternal: false },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTicket(tenantId: string, email: string, dto: CreateClientPortalTicketDto) {
    const client = await this.getClientByUser(tenantId, email);

    return this.prisma.supportTicket.create({
      data: {
        tenantId,
        clientId: client.id,
        subject: dto.subject,
        description: dto.description,
        priority: dto.priority ?? 'medium',
        status: 'open',
      },
    });
  }
}
