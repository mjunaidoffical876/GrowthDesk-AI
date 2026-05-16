import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

const ROLE_PERMISSIONS: Record<string, string[]> = {
  owner: ['*'],
  admin: ['*'],
  manager: ['clients.read', 'clients.write', 'leads.read', 'leads.write', 'projects.read', 'projects.write', 'tasks.read', 'tasks.write', 'invoices.read', 'tickets.read', 'tickets.write', 'ai.use'],
  staff: ['clients.read', 'leads.read', 'projects.read', 'tasks.read', 'tasks.write', 'tickets.read', 'tickets.write', 'ai.use'],
  client: ['client_portal.read', 'tickets.write'],
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    if (!required?.length) return true;
    const request = context.switchToHttp().getRequest();
    const role = request.user?.role || 'staff';
    const allowed = ROLE_PERMISSIONS[role] || [];
    return allowed.includes('*') || required.every((permission) => allowed.includes(permission));
  }
}
