import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findTeam(@CurrentUser() user: CurrentUserPayload) {
    return this.usersService.findTeam(user.tenantId);
  }

  @Post()
  createTeamMember(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateTeamMemberDto) {
    return this.usersService.createTeamMember(user.tenantId, dto);
  }

  @Patch(':id')
  updateTeamMember(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateTeamMemberDto,
  ) {
    return this.usersService.updateTeamMember(user.tenantId, id, dto, user.id);
  }

  @Patch(':id/deactivate')
  deactivateTeamMember(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.usersService.deactivateTeamMember(user.tenantId, id, user.id);
  }
}
