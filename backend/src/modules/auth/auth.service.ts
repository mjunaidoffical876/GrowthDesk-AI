import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    const slug = this.slugify(dto.companyName);

    const existingTenant = await this.prisma.tenant.findUnique({ where: { slug } });
    if (existingTenant) throw new BadRequestException('Company workspace already exists');

    const existingUser = await this.prisma.user.findFirst({ where: { email } });
    if (existingUser) throw new BadRequestException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const tenant = await this.prisma.tenant.create({
      data: {
        companyName: dto.companyName,
        slug,
        email,
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        users: {
          create: {
            fullName: dto.fullName,
            email,
            passwordHash,
            role: UserRole.owner,
          },
        },
      },
      include: { users: true },
    });

    const user = tenant.users[0];
    const token = this.signToken(user.id, tenant.id, user.email, user.role);

    return {
      token,
      user: this.safeUser(user),
      tenant: this.safeTenant(tenant),
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
      include: { tenant: true },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user.status !== 'active') throw new UnauthorizedException('User is inactive');
    if (user.tenant.deletedAt) throw new UnauthorizedException('Workspace is disabled');

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = this.signToken(user.id, user.tenantId, user.email, user.role);

    return {
      token,
      user: this.safeUser(user),
      tenant: this.safeTenant(user.tenant),
    };
  }

  async me(userId: string, tenantId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId, deletedAt: null },
      include: { tenant: true },
    });

    if (!user) throw new UnauthorizedException('User not found');

    return {
      user: this.safeUser(user),
      tenant: this.safeTenant(user.tenant),
    };
  }

  private signToken(userId: string, tenantId: string, email: string, role: string) {
    return this.jwtService.sign({ sub: userId, tenantId, email, role });
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  private safeUser(user: any) {
    const { passwordHash, ...safe } = user;
    return safe;
  }

  private safeTenant(tenant: any) {
    const { users, ...safe } = tenant;
    return safe;
  }
}
