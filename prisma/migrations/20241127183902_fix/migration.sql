-- DropIndex
DROP INDEX "MonthlyBalance_year_month_userID_idx";

-- CreateIndex
CREATE INDEX "MonthlyBalance_year_month_idx" ON "MonthlyBalance"("year", "month");
