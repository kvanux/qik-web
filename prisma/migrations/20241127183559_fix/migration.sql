-- DropIndex
DROP INDEX "MonthlyBalance_year_month_idx";

-- CreateIndex
CREATE INDEX "MonthlyBalance_year_month_userID_idx" ON "MonthlyBalance"("year", "month", "userID");
