import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Payment, Prisma } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) { }

  async getPayments({ skip, take }: { skip?: number; take?: number } = {}): Promise<Payment[]> {
    return await this.prisma.payment.findMany({ skip, take })
  }

  async getPayment({ id }: { id: number }): Promise<Payment | null> {
    return await this.prisma.payment.findUnique({ where: { id } });
  }

  async createPayment({ accountId, data }: { accountId: number; data: Prisma.PaymentCreateInput }): Promise<Payment> {
    return await this.prisma.payment.create({
      data: {
        ...data,
        Account: {
          connect: { id: accountId }
        
        }
      }
    });
  }

  async updatePayment({ id, data }: { 
    id: number; 
    data: Prisma.PaymentUpdateInput 
  }): Promise<Payment> {
    return await this.prisma.payment.update({ where: { id }, data });
  }
}