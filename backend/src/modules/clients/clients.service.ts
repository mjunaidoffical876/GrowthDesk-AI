import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.client.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { projects: true, invoices: true, tickets: true } },
      },
    });
  }

  async findOne(tenantId: string, id: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { projects: true, invoices: true, tickets: true },
    });

    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async create(tenantId: string, dto: CreateClientDto) {
    return this.prisma.client.create({
      data: {
        tenantId,
        companyName: dto.companyName,
        contactPerson: dto.contactPerson,
        email: dto.email?.toLowerCase().trim(),
        phone: dto.phone,
        status: dto.status || 'active',
        notes: dto.notes,
      },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateClientDto) {
    await this.ensureTenantOwnership(tenantId, id);

    return this.prisma.client.update({
      where: { id },
      data: {
        ...dto,
        email: dto.email ? dto.email.toLowerCase().trim() : undefined,
      },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.ensureTenantOwnership(tenantId, id);

    return this.prisma.client.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'inactive' },
    });
  }

  private async ensureTenantOwnership(tenantId: string, id: string) {
    const record = await this.prisma.client.findUnique({ where: { id } });
    if (!record || record.deletedAt) throw new NotFoundException('Client not found');
    if (record.tenantId !== tenantId) throw new ForbiddenException('Access denied');
  }
}
