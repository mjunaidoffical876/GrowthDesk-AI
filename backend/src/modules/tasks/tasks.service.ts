import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, projectId?: string) {
    return this.prisma.task.findMany({
      where: { tenantId, projectId, deletedAt: null },
      orderBy: [{ status: 'asc' }, { dueDate: 'asc' }, { createdAt: 'desc' }],
      include: {
        project: { select: { id: true, title: true, status: true } },
        assignedTo: { select: { id: true, fullName: true, email: true } },
      },
    });
  }

  async findOne(tenantId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        project: true,
        assignedTo: { select: { id: true, fullName: true, email: true } },
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async create(tenantId: string, dto: CreateTaskDto) {
    await this.ensureProjectBelongsToTenant(tenantId, dto.projectId);
    if (dto.assignedToId) await this.ensureUserBelongsToTenant(tenantId, dto.assignedToId);

    return this.prisma.task.create({
      data: {
        tenantId,
        projectId: dto.projectId,
        assignedToId: dto.assignedToId,
        title: dto.title.trim(),
        description: dto.description,
        priority: dto.priority || 'medium',
        status: dto.status || 'todo',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
      include: { assignedTo: { select: { id: true, fullName: true, email: true } }, project: true },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateTaskDto) {
    await this.ensureTenantOwnership(tenantId, id);
    if (dto.projectId) await this.ensureProjectBelongsToTenant(tenantId, dto.projectId);
    if (dto.assignedToId) await this.ensureUserBelongsToTenant(tenantId, dto.assignedToId);

    return this.prisma.task.update({
      where: { id },
      data: {
        projectId: dto.projectId,
        assignedToId: dto.assignedToId,
        title: dto.title?.trim(),
        description: dto.description,
        priority: dto.priority,
        status: dto.status,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
      include: { assignedTo: { select: { id: true, fullName: true, email: true } }, project: true },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.ensureTenantOwnership(tenantId, id);
    return this.prisma.task.update({ where: { id }, data: { deletedAt: new Date(), status: 'archived' } });
  }

  private async ensureTenantOwnership(tenantId: string, id: string) {
    const record = await this.prisma.task.findUnique({ where: { id } });
    if (!record || record.deletedAt) throw new NotFoundException('Task not found');
    if (record.tenantId !== tenantId) throw new ForbiddenException('Access denied');
  }

  private async ensureProjectBelongsToTenant(tenantId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({ where: { id: projectId, tenantId, deletedAt: null } });
    if (!project) throw new NotFoundException('Project not found for this tenant');
  }

  private async ensureUserBelongsToTenant(tenantId: string, userId: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId, tenantId, deletedAt: null, status: 'active' } });
    if (!user) throw new NotFoundException('Assigned user not found for this tenant');
  }
}
