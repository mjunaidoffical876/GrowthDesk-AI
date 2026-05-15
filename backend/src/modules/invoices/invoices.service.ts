import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.invoice.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { id: true, companyName: true, contactPerson: true, email: true } },
        items: true,
      },
    });
  }

  async findOne(tenantId: string, id: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { client: true, items: true },
    });

    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async create(tenantId: string, dto: CreateInvoiceDto) {
    await this.ensureClientBelongsToTenant(tenantId, dto.clientId);
    const invoiceNumber = dto.invoiceNumber || (await this.generateInvoiceNumber(tenantId));
    const totals = this.calculateTotals(dto.items || [], dto.taxAmount || 0, dto.discount || 0, dto.paidAmount || 0);

    return this.prisma.invoice.create({
      data: {
        tenantId,
        clientId: dto.clientId,
        invoiceNumber,
        status: dto.status || 'draft',
        subTotal: totals.subTotal,
        taxAmount: totals.taxAmount,
        discount: totals.discount,
        totalAmount: totals.totalAmount,
        paidAmount: totals.paidAmount,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        items: {
          create: (dto.items || []).map((item) => ({
            description: item.description.trim(),
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice,
            total: (item.quantity || 1) * item.unitPrice,
          })),
        },
      },
      include: { client: true, items: true },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateInvoiceDto) {
    await this.ensureTenantOwnership(tenantId, id);
    if (dto.clientId) await this.ensureClientBelongsToTenant(tenantId, dto.clientId);

    const existing = await this.findOne(tenantId, id);
    const items = dto.items || existing.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
    }));
    const totals = this.calculateTotals(
      items,
      dto.taxAmount ?? Number(existing.taxAmount),
      dto.discount ?? Number(existing.discount),
      dto.paidAmount ?? Number(existing.paidAmount),
    );

    return this.prisma.$transaction(async (tx) => {
      if (dto.items) {
        await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
      }

      return tx.invoice.update({
        where: { id },
        data: {
          clientId: dto.clientId,
          invoiceNumber: dto.invoiceNumber,
          status: dto.status,
          subTotal: totals.subTotal,
          taxAmount: totals.taxAmount,
          discount: totals.discount,
          totalAmount: totals.totalAmount,
          paidAmount: totals.paidAmount,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
          items: dto.items
            ? {
                create: dto.items.map((item) => ({
                  description: item.description.trim(),
                  quantity: item.quantity || 1,
                  unitPrice: item.unitPrice,
                  total: (item.quantity || 1) * item.unitPrice,
                })),
              }
            : undefined,
        },
        include: { client: true, items: true },
      });
    });
  }

  async markPaid(tenantId: string, id: string) {
    const invoice = await this.findOne(tenantId, id);
    return this.prisma.invoice.update({
      where: { id },
      data: { status: 'paid', paidAmount: invoice.totalAmount },
      include: { client: true, items: true },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.ensureTenantOwnership(tenantId, id);
    return this.prisma.invoice.update({ where: { id }, data: { deletedAt: new Date(), status: 'cancelled' } });
  }

  private calculateTotals(
    items: Array<{ quantity?: number; unitPrice: number | DecimalLike }>,
    taxAmount: number,
    discount: number,
    paidAmount: number,
  ) {
    const subTotal = items.reduce((sum, item) => sum + (item.quantity || 1) * Number(item.unitPrice), 0);
    const totalAmount = Math.max(subTotal + taxAmount - discount, 0);
    const normalizedPaid = Math.min(Math.max(paidAmount, 0), totalAmount);
    return { subTotal, taxAmount, discount, totalAmount, paidAmount: normalizedPaid };
  }

  private async generateInvoiceNumber(tenantId: string) {
    const count = await this.prisma.invoice.count({ where: { tenantId } });
    return `INV-${String(count + 1).padStart(5, '0')}`;
  }

  private async ensureTenantOwnership(tenantId: string, id: string) {
    const record = await this.prisma.invoice.findUnique({ where: { id } });
    if (!record || record.deletedAt) throw new NotFoundException('Invoice not found');
    if (record.tenantId !== tenantId) throw new ForbiddenException('Access denied');
  }

  private async ensureClientBelongsToTenant(tenantId: string, clientId: string) {
    const client = await this.prisma.client.findFirst({ where: { id: clientId, tenantId, deletedAt: null } });
    if (!client) throw new NotFoundException('Client not found for this tenant');
  }
}

type DecimalLike = { toString(): string };
