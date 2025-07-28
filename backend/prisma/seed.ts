import { PrismaClient, PaymentStatus, type Account } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: '../.env' });

const prisma = new PrismaClient();

const numberOfAccounts = 50;
const numberOfPayments = 200;

async function main() {
  console.log('Starting seeding...');

  // Create Accounts
  const accounts: Account[] = [];
  for (let i = 0; i < numberOfAccounts; i++) {
    const account = await prisma.account.create({
      data: {
        name: faker.person.fullName(),
        address: faker.location.streetAddress(),
        phoneNumber: faker.phone.number(),
        bankAccountNumber: faker.number.int({ min: 10000000, max: 99999999 }),
      },
    });
    accounts.push(account);
    console.log(`Created account with id: ${account.id}`);
  }

  // Create Payments linked to Accounts
  for (let i = 0; i < numberOfPayments; i++) {
    // Select a random account
    const randomAccount = faker.helpers.arrayElement(accounts);

    const payment = await prisma.payment.create({
      data: {
        amount: parseFloat(faker.finance.amount({ min: 10, max: 1000, dec: 2 })),
        notes: Math.random() > 0.3 ? faker.lorem.sentence() : null,
        status: faker.helpers.arrayElement([PaymentStatus.PENDING, PaymentStatus.APPROVED]),
        accountId: randomAccount.id,
        recipientName: faker.person.fullName(),
        recipientBankName: faker.company.name() + ' Bank',
        recipientAccountNumber: faker.finance.accountNumber(8),
      },
    });
    console.log(`Created payment ${payment.id} for account ${randomAccount.id}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
