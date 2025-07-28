import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Account, Prisma } from '@prisma/client';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) { }

  async createAccount(params: { data: Prisma.AccountCreateInput }): Promise<Account> {
    return await this.prisma.account.create({
      data: params.data
    });
  }

  async getAccounts({ skip, take }: { skip?: number; take?: number } = {}): Promise<Account[]> {
    return await this.prisma.account.findMany({ skip, take })
  }

  async getAccount({ id }: { id: number }): Promise<Account | null> {
    return await this.prisma.account.findUnique({ where: { id } });
  }

  async updateAccount({ id, data }: {
    id: number;
    data: Prisma.AccountUpdateInput
  }): Promise<Account> {
    return await this.prisma.account.update({ where: { id }, data });
  }

  async getTotal(): Promise<number> {
    return await this.prisma.account.count();
  }
}