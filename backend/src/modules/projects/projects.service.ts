import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.project.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { id: true, companyName: true, contactPerson: true } },
        createdBy: { select: { id: true, fullName: true, email: true } },
        _count: { select: { tasks: true } },
      },
    });
  }

  async findOne(tenantId: string, id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        client: true,
        createdBy: { select: { id: true, fullName: true, email: true } },
        tasks: {
          where: { deletedAt: null },
          orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
          include: { assignedTo: { select: { id: true, fullName: true, email: true } } },
        },
      },
    });

    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async create(tenantId: string, userId: string, dto: CreateProjectDto) {
    if (dto.clientId) await this.ensureClientBelongsToTenant(tenantId, dto.clientId);

    return this.prisma.project.create({
      data: {
        tenantId,
        createdById: userId,
        clientId: dto.clientId,
        title: dto.title.trim(),
        description: dto.description,
        status: dto.status || 'active',
        budget: dto.budget,
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
      },
      include: { client: true, _count: { select: { tasks: true } } },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateProjectDto) {
    await this.ensureTenantOwnership(tenantId, id);
    if (dto.clientId) await this.ensureClientBelongsToTenant(tenantId, dto.clientId);

    return this.prisma.project.update({
      where: { id },
      data: {
        title: dto.title?.trim(),
        clientId: dto.clientId,
        description: dto.description,
        status: dto.status,
        budget: dto.budget,
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
      },
      include: { client: true, _count: { select: { tasks: true } } },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.ensureTenantOwnership(tenantId, id);
    return this.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'archived' },
    });
  }

  private async ensureTenantOwnership(tenantId: string, id: string) {
    const record = await this.prisma.project.findUnique({ where: { id } });
    if (!record || record.deletedAt) throw new NotFoundException('Project not found');
    if (record.tenantId !== tenantId) throw new ForbiddenException('Access denied');
  }

  private async ensureClientBelongsToTenant(tenantId: string, clientId: string) {
    const client = await this.prisma.client.findFirst({ where: { id: clientId, tenantId, deletedAt: null } });
    if (!client) throw new NotFoundException('Client not found for this tenant');
  }
}
