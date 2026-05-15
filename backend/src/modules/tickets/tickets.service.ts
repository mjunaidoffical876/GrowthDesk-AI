import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTicketReplyDto } from './dto/create-ticket-reply.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.supportTicket.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { id: true, companyName: true, contactPerson: true, email: true } },
        assignedTo: { select: { id: true, fullName: true, email: true } },
        _count: { select: { replies: true } },
      },
    });
  }

  async findOne(tenantId: string, id: string) {
    const ticket = await this.prisma.supportTicket.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        client: true,
        assignedTo: { select: { id: true, fullName: true, email: true } },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, fullName: true, email: true } },
            client: { select: { id: true, companyName: true, contactPerson: true, email: true } },
          },
        },
      },
    });

    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async create(tenantId: string, userId: string, dto: CreateTicketDto) {
    if (dto.clientId) await this.ensureClientBelongsToTenant(tenantId, dto.clientId);
    if (dto.assignedToId) await this.ensureUserBelongsToTenant(tenantId, dto.assignedToId);

    return this.prisma.supportTicket.create({
      data: {
        tenantId,
        clientId: dto.clientId,
        subject: dto.subject.trim(),
        description: dto.description,
        priority: dto.priority || 'medium',
        status: dto.status || 'open',
        assignedToId: dto.assignedToId,
        createdById: userId,
      },
      include: { client: true, assignedTo: { select: { id: true, fullName: true, email: true } } },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateTicketDto) {
    await this.ensureTenantOwnership(tenantId, id);
    if (dto.clientId) await this.ensureClientBelongsToTenant(tenantId, dto.clientId);
    if (dto.assignedToId) await this.ensureUserBelongsToTenant(tenantId, dto.assignedToId);

    return this.prisma.supportTicket.update({
      where: { id },
      data: {
        clientId: dto.clientId,
        subject: dto.subject?.trim(),
        description: dto.description,
        priority: dto.priority,
        status: dto.status,
        assignedToId: dto.assignedToId,
      },
      include: { client: true, assignedTo: { select: { id: true, fullName: true, email: true } } },
    });
  }

  async reply(tenantId: string, userId: string, id: string, dto: CreateTicketReplyDto) {
    await this.ensureTenantOwnership(tenantId, id);

    return this.prisma.ticketReply.create({
      data: {
        ticketId: id,
        tenantId,
        userId,
        message: dto.message.trim(),
        isInternal: dto.isInternal || false,
      },
      include: { user: { select: { id: true, fullName: true, email: true } } },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.ensureTenantOwnership(tenantId, id);
    return this.prisma.supportTicket.update({ where: { id }, data: { deletedAt: new Date(), status: 'closed' } });
  }

  private async ensureTenantOwnership(tenantId: string, id: string) {
    const record = await this.prisma.supportTicket.findUnique({ where: { id } });
    if (!record || record.deletedAt) throw new NotFoundException('Ticket not found');
    if (record.tenantId !== tenantId) throw new ForbiddenException('Access denied');
  }

  private async ensureClientBelongsToTenant(tenantId: string, clientId: string) {
    const client = await this.prisma.client.findFirst({ where: { id: clientId, tenantId, deletedAt: null } });
    if (!client) throw new NotFoundException('Client not found for this tenant');
  }

  private async ensureUserBelongsToTenant(tenantId: string, userId: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId, tenantId, deletedAt: null } });
    if (!user) throw new NotFoundException('User not found for this tenant');
  }
}
