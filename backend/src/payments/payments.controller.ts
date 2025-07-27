import { Controller, Get, Param, Post, Patch, Body, ParseIntPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Prisma } from '@prisma/client';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async getAll() {
    return this.paymentsService.getPayments();
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.getPayment({ id: id });
  }

  @Post(':accountId')
  async create(
    @Param('accountId', ParseIntPipe) accountId: number, 
    @Body() data: Prisma.PaymentCreateInput
  ) {
    return this.paymentsService.createPayment({ accountId, data });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() data: Prisma.PaymentUpdateInput
  ) {
    return this.paymentsService.updatePayment({ id, data });
  }
}
