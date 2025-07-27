import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { PaymentsModule } from './payments/payments.module';
import { AccountsController } from './accounts/accounts.controller';
import { PaymentsController } from './payments/payments.controller';
import { AccountsService } from './accounts/accounts.service';
import { PaymentsService } from './payments/payments.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    PaymentsModule,
    AccountsModule
  ],
  controllers: [
    PaymentsController,
    AccountsController
  ],
  providers: [
    PaymentsService,
    AccountsService,
    PrismaService
  ],
  exports: [PrismaService],
})
export class AppModule {}
