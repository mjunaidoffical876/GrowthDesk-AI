import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser } from '../../common/types/auth-user';
import { CreateTicketReplyDto } from './dto/create-ticket-reply.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketsService } from './tickets.service';

@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.ticketsService.findAll(user.tenantId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.ticketsService.findOne(user.tenantId, id);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateTicketDto) {
    return this.ticketsService.create(user.tenantId, user.id, dto);
  }

  @Patch(':id')
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.ticketsService.update(user.tenantId, id, dto);
  }

  @Post(':id/replies')
  reply(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: CreateTicketReplyDto) {
    return this.ticketsService.reply(user.tenantId, user.id, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.ticketsService.remove(user.tenantId, id);
  }
}
