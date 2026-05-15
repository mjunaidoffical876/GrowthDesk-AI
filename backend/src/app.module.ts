import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { UsersModule } from './modules/users/users.module';
import { ClientsModule } from './modules/clients/clients.module';
import { LeadsModule } from './modules/leads/leads.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { AiModule } from './modules/ai/ai.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    TenantsModule,
    UsersModule,
    ClientsModule,
    LeadsModule,
    ProjectsModule,
    TasksModule,
    InvoicesModule,
    AiModule,
    TicketsModule,
    SubscriptionsModule,
    SuperAdminModule,
  ],
})
export class AppModule {}
