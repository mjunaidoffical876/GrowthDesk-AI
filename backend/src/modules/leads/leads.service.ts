import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

const VALID_STATUSES = ['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'];

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, status?: string) {
    return this.prisma.lead.findMany({
      where: {
        tenantId,
        deletedAt: null,
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: { assignedTo: { select: { id: true, fullName: true, email: true } } },
    });
  }

  async findOne(tenantId: string, id: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { assignedTo: { select: { id: true, fullName: true, email: true } } },
    });

    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async create(tenantId: string, dto: CreateLeadDto) {
    this.validateStatus(dto.status);
    await this.validateAssignee(tenantId, dto.assignedToId);

    return this.prisma.lead.create({
      data: {
        tenantId,
        fullName: dto.fullName,
        company: dto.company,
        email: dto.email?.toLowerCase().trim(),
        phone: dto.phone,
        source: dto.source,
        status: dto.status || 'new',
        value: dto.value,
        assignedToId: dto.assignedToId,
        notes: dto.notes,
        followUpDate: dto.followUpDate ? new Date(dto.followUpDate) : undefined,
      },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateLeadDto) {
    await this.ensureTenantOwnership(tenantId, id);
    this.validateStatus(dto.status);
    await this.validateAssignee(tenantId, dto.assignedToId);

    return this.prisma.lead.update({
      where: { id },
      data: {
        ...dto,
        email: dto.email ? dto.email.toLowerCase().trim() : undefined,
        followUpDate: dto.followUpDate ? new Date(dto.followUpDate) : undefined,
      },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.ensureTenantOwnership(tenantId, id);
    return this.prisma.lead.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  private validateStatus(status?: string) {
    if (status && !VALID_STATUSES.includes(status)) {
      throw new BadRequestException(`Invalid lead status. Use one of: ${VALID_STATUSES.join(', ')}`);
    }
  }

  private async validateAssignee(tenantId: string, assignedToId?: string) {
    if (!assignedToId) return;
    const user = await this.prisma.user.findFirst({ where: { id: assignedToId, tenantId, deletedAt: null } });
    if (!user) throw new BadRequestException('Assigned user does not belong to this workspace');
  }

  private async ensureTenantOwnership(tenantId: string, id: string) {
    const record = await this.prisma.lead.findUnique({ where: { id } });
    if (!record || record.deletedAt) throw new NotFoundException('Lead not found');
    if (record.tenantId !== tenantId) throw new ForbiddenException('Access denied');
  }
}
