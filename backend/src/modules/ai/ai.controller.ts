import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser } from '../../common/types/auth-user';
import { AiService } from './ai.service';
import { GenerateContentDto } from './dto/generate-content.dto';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  generate(@CurrentUser() user: AuthUser, @Body() dto: GenerateContentDto) {
    return this.aiService.generate(user.tenantId, user.id, dto);
  }

  @Get('usage')
  usage(@CurrentUser() user: AuthUser) {
    return this.aiService.usage(user.tenantId);
  }
}
