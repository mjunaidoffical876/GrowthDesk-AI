import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser } from '../../common/types/auth-user';
import { ClientPortalService } from './client-portal.service';
import { CreateClientPortalTicketDto } from './dto/create-client-portal-ticket.dto';

@UseGuards(JwtAuthGuard)
@Controller('client-portal')
export class ClientPortalController {
  constructor(private readonly clientPortalService: ClientPortalService) {}

  @Get('overview')
  overview(@CurrentUser() user: AuthUser) {
    return this.clientPortalService.getOverview(user.tenantId, user.email);
  }

  @Get('projects')
  projects(@CurrentUser() user: AuthUser) {
    return this.clientPortalService.getProjects(user.tenantId, user.email);
  }

  @Get('invoices')
  invoices(@CurrentUser() user: AuthUser) {
    return this.clientPortalService.getInvoices(user.tenantId, user.email);
  }

  @Get('tickets')
  tickets(@CurrentUser() user: AuthUser) {
    return this.clientPortalService.getTickets(user.tenantId, user.email);
  }

  @Post('tickets')
  createTicket(@CurrentUser() user: AuthUser, @Body() dto: CreateClientPortalTicketDto) {
    return this.clientPortalService.createTicket(user.tenantId, user.email, dto);
  }
}
