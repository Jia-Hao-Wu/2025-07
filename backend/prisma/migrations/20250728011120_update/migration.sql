/*
  Warnings:

  - You are about to drop the column `userId` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `accountId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientAccountNumber` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientBankName` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientName` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "userId",
ADD COLUMN     "accountId" INTEGER NOT NULL,
ADD COLUMN     "recipientAccountNumber" TEXT NOT NULL,
ADD COLUMN     "recipientBankName" TEXT NOT NULL,
ADD COLUMN     "recipientName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
