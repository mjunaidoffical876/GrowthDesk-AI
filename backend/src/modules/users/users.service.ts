import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findTeam(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId, deletedAt: null },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        status: true,
        avatarUrl: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTeamMember(tenantId: string, dto: CreateTeamMemberDto) {
    const existing = await this.prisma.user.findUnique({
      where: { tenantId_email: { tenantId, email: dto.email.toLowerCase() } },
    });
    if (existing) throw new ConflictException('A team member with this email already exists.');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        tenantId,
        fullName: dto.fullName,
        email: dto.email.toLowerCase(),
        passwordHash,
        role: dto.role ?? 'staff',
        status: 'active',
      },
      select: { id: true, fullName: true, email: true, role: true, status: true, createdAt: true },
    });
  }

  async updateTeamMember(tenantId: string, memberId: string, dto: UpdateTeamMemberDto, currentUserId: string) {
    const member = await this.prisma.user.findFirst({ where: { id: memberId, tenantId, deletedAt: null } });
    if (!member) throw new NotFoundException('Team member not found.');

    if (member.id === currentUserId && dto.status === 'inactive') {
      throw new ForbiddenException('You cannot deactivate your own account.');
    }

    return this.prisma.user.update({
      where: { id: memberId },
      data: {
        fullName: dto.fullName ?? undefined,
        role: dto.role ?? undefined,
        status: dto.status ?? undefined,
      },
      select: { id: true, fullName: true, email: true, role: true, status: true, updatedAt: true },
    });
  }

  async deactivateTeamMember(tenantId: string, memberId: string, currentUserId: string) {
    if (memberId === currentUserId) throw new ForbiddenException('You cannot deactivate your own account.');

    const member = await this.prisma.user.findFirst({ where: { id: memberId, tenantId, deletedAt: null } });
    if (!member) throw new NotFoundException('Team member not found.');

    return this.prisma.user.update({
      where: { id: memberId },
      data: { status: 'inactive' },
      select: { id: true, fullName: true, email: true, role: true, status: true },
    });
  }
}
