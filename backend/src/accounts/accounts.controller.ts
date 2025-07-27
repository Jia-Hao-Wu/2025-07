import { Controller, Get, Param, Post, Patch, Body, ParseIntPipe } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Prisma } from '@prisma/client';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  async getAll() {
    return this.accountsService.getAccounts();
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.getAccount({ id });
  }

  @Post()
  async create(@Body() data: Prisma.AccountCreateInput) {
    return this.accountsService.createAccount({ data });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() data: Prisma.AccountUpdateInput
  ) {
    return this.accountsService.updateAccount({ id, data });
  }
}
