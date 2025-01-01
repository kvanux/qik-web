/*
  Warnings:

  - A unique constraint covering the columns `[year,month,userID]` on the table `MonthlyBalance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MonthlyBalance_year_month_idx";

-- DropIndex
DROP INDEX "MonthlyBalance_year_month_key";

-- CreateIndex
CREATE INDEX "MonthlyBalance_year_month_userID_idx" ON "MonthlyBalance"("year", "month", "userID");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyBalance_year_month_userID_key" ON "MonthlyBalance"("year", "month", "userID");
