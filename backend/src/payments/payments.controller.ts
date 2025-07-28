import { Controller, Get, Param, Post, Patch, Body, ParseIntPipe, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Prisma } from '@prisma/client';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Get()
  async getAll(@Query('skip') skip = '0', @Query('take') take = '10', @Query('accountId') accountId?: string) {
    const data = await this.paymentsService.getPayments({
      skip: parseInt(skip, 10),
      take: parseInt(take, 10),
      accountId: accountId ? parseInt(accountId, 10) : undefined,
    });
    const total = await this.paymentsService.getTotal();
    return { data, total };
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
    console.log(data);
    return this.paymentsService.updatePayment({ id, data });
  }

}
