import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { GenerateContentDto } from './dto/generate-content.dto';

@Injectable()
export class AiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async generate(tenantId: string, userId: string, dto: GenerateContentDto) {
    const usage = await this.usage(tenantId);
    const monthlyLimit = Number(this.config.get('AI_MONTHLY_LIMIT') || 1000);

    if (usage.monthlyRequests >= monthlyLimit) {
      throw new ForbiddenException('AI monthly usage limit exceeded');
    }

    const systemPrompt = this.buildSystemPrompt(dto.toolType, dto.tone);
    const response = await this.callOpenAI(systemPrompt, dto.prompt);
    const inputTokens = this.estimateTokens(systemPrompt + dto.prompt);
    const outputTokens = this.estimateTokens(response);
    const estimatedCost = this.estimateCost(inputTokens, outputTokens);

    const request = await this.prisma.aIRequest.create({
      data: {
        tenantId,
        userId,
        toolType: dto.toolType,
        prompt: dto.prompt,
        response,
        inputTokens,
        outputTokens,
        estimatedCost,
      },
    });

    return {
      id: request.id,
      toolType: request.toolType,
      response,
      usage: {
        inputTokens,
        outputTokens,
        estimatedCost,
        monthlyLimit,
        monthlyRequestsBeforeThis: usage.monthlyRequests,
      },
    };
  }

  async usage(tenantId: string) {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [allRequests, monthlyRequests, byTool] = await Promise.all([
      this.prisma.aIRequest.findMany({ where: { tenantId } }),
      this.prisma.aIRequest.findMany({ where: { tenantId, createdAt: { gte: monthStart } } }),
      this.prisma.aIRequest.groupBy({
        by: ['toolType'],
        where: { tenantId },
        _count: { toolType: true },
        _sum: { inputTokens: true, outputTokens: true, estimatedCost: true },
      }),
    ]);

    const totals = allRequests.reduce(
      (acc, item) => {
        acc.totalRequests += 1;
        acc.totalInputTokens += item.inputTokens;
        acc.totalOutputTokens += item.outputTokens;
        acc.estimatedCost += Number(item.estimatedCost);
        return acc;
      },
      { totalRequests: 0, totalInputTokens: 0, totalOutputTokens: 0, estimatedCost: 0 },
    );

    return {
      ...totals,
      totalTokens: totals.totalInputTokens + totals.totalOutputTokens,
      monthlyRequests: monthlyRequests.length,
      monthlyLimit: Number(this.config.get('AI_MONTHLY_LIMIT') || 1000),
      byTool: byTool.map((item) => ({
        toolType: item.toolType,
        requests: item._count.toolType,
        tokens: (item._sum.inputTokens || 0) + (item._sum.outputTokens || 0),
        estimatedCost: Number(item._sum.estimatedCost || 0),
      })),
    };
  }

  private buildSystemPrompt(toolType: string, tone?: string) {
    const selectedTone = tone || 'professional, clear, conversion-focused';
    const prompts: Record<string, string> = {
      blog_writer: 'Create a practical blog outline with title, intro, H2/H3 structure, key points, and CTA.',
      seo_meta: 'Create one SEO title, one meta description, focus keywords, and search intent notes.',
      proposal_writer: 'Create a professional client proposal with scope, deliverables, timeline, value proposition, and CTA.',
      email_reply: 'Create a concise professional email reply that is polite, confident, and action-oriented.',
      social_post: 'Create a high-engagement social media post with hook, body, CTA, and hashtags.',
    };
    return `${prompts[toolType]} Tone: ${selectedTone}. Return clean formatted text only.`;
  }

  private async callOpenAI(systemPrompt: string, userPrompt: string) {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    const model = this.config.get<string>('OPENAI_MODEL') || 'gpt-4o-mini';

    if (!apiKey) {
      return this.localFallback(systemPrompt, userPrompt);
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenAI request failed: ${text}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'No AI response generated.';
  }

  private localFallback(systemPrompt: string, userPrompt: string) {
    return [
      'Demo AI Response',
      '',
      `Instruction: ${systemPrompt}`,
      '',
      `Input: ${userPrompt}`,
      '',
      'Add OPENAI_API_KEY in backend/.env to enable real AI generation.',
    ].join('\n');
  }

  private estimateTokens(text: string) {
    return Math.ceil(text.length / 4);
  }

  private estimateCost(inputTokens: number, outputTokens: number) {
    return Number(((inputTokens / 1_000_000) * 0.15 + (outputTokens / 1_000_000) * 0.6).toFixed(6));
  }
}
