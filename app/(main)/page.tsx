import QikLogger from "@/components/ui/custom/qikLogger/QikLogger";
import ExpenseCalendar from "@/components/ui/custom/expenseCalendar/expenseCalendar";
import prisma from "@/prisma/client";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { UserType } from "@/types/supabase";
import ErrorBoundary from "@/components/fnc/ErrorBoundary";

export default async function Home() {
  try {
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return <div>Please log in to view this page</div>;
    }

    const currentUser = session?.user as UserType;
    const currentUserID = currentUser?.id;

    try {
      const [expenses, income, billing, category] = await Promise.all([
        prisma.expense.findMany({
          where: { userID: currentUserID },
        }),
        prisma.income.findMany({
          where: { userID: currentUserID },
        }),
        prisma.billing.findMany({
          where: { userID: currentUserID },
        }),
        prisma.category.findMany({
          where: { userID: currentUserID },
        }),
      ]);

      return (
        <div className="grid grid-cols-12 gap-6 w-full max-w-[1840px] self-center min-[360px]:max-[800px]:flex min-[360px]:max-[800px]:flex-col min-[360px]:max-[800px]:gap-4">
          <div className="col-span-3 bg-white rounded-xl px-5 pt-4 pb-6 h-fit shadow-qele-panel min-[360px]:max-[800px]:w-full">
            <div className="flex flex-col gap-4 w-full">
              <div className="w-full flex items-center">
                <h2 className="text-xl font-semibold text-slate-800 w-full min-[360px]:max-[800px]:text-lg">
                  Chi phí mới
                </h2>
                <div className="flex gap-2"></div>
              </div>
              <div className="w-full">
                <ErrorBoundary>
                  <QikLogger categories={category} />
                </ErrorBoundary>
              </div>
            </div>
          </div>
          <div className="col-span-9 bg-white rounded-xl px-5 py-4 shadow-qele-panel min-[360px]:max-[800px]:w-full">
            <ErrorBoundary>
              <ExpenseCalendar
                expenses={expenses}
                income={income}
                billing={billing}
                currentUserId={currentUserID as string}
              />
            </ErrorBoundary>
          </div>
        </div>
      );
    } catch (dbError) {
      console.error("Database error:", dbError);
      return <div>Error loading data</div>;
    }
  } catch (error) {
    console.error("Page error:", error);
    return <div>An error occurred loading the page</div>;
  }
}
