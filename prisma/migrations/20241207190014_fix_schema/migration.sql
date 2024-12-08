-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_categoryID_fkey";

-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "categoryID" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_categoryID_fkey" FOREIGN KEY ("categoryID") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
