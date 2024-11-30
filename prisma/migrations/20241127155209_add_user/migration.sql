/*
  Warnings:

  - A unique constraint covering the columns `[userID]` on the table `Billing` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userID]` on the table `Expense` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userID]` on the table `Income` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userID]` on the table `MonthlyBalance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userID` to the `Billing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Income` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `MonthlyBalance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Billing" ADD COLUMN     "userID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "userID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Income" ADD COLUMN     "userID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MonthlyBalance" ADD COLUMN     "userID" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Billing_userID_key" ON "Billing"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Expense_userID_key" ON "Expense"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Income_userID_key" ON "Income"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyBalance_userID_key" ON "MonthlyBalance"("userID");

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Billing" ADD CONSTRAINT "Billing_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyBalance" ADD CONSTRAINT "MonthlyBalance_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
