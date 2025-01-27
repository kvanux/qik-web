import * as React from "react";
import QikLogger from "@/components/ui/custom/qikLogger/QikLogger";
import ExpenseCalendar from "@/components/ui/custom/expenseCalendar/expenseCalendar";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions/auth";
import CategoryDrawer from "@/components/ui/custom/listingDrawer/CategoryDrawer";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) console.log("Session not found");
  const currentUser = await prisma.user.findUnique({
    where: { email: session!.user!.email as string },
  });
  const currentUserID = currentUser?.id;

  const expenses = await prisma.expense.findMany({
    where: { userID: currentUserID },
  });
  const income = await prisma.income.findMany({
    where: { userID: currentUserID },
  });
  const billing = await prisma.billing.findMany({
    where: { userID: currentUserID },
  });
  const category = await prisma.category.findMany({
    where: { userID: currentUserID },
  });

  return (
    <div
      className="grid grid-cols-12 gap-6 w-full max-w-[1840px] self-center min-[360px]:max-[800px]:flex min-[360px]:max-[800px]:flex-col min-[360px]:max-[800px]:gap-4"
    >
      <div
        className="col-span-3 bg-white rounded-xl px-5 pt-4 pb-6 h-fit shadow-qele-panel min-[360px]:max-[800px]:w-full"
      >
        <div className="flex flex-col gap-4 w-full">
          <div className="w-full flex items-center">
            <h2 className="text-xl font-semibold text-slate-800 w-full min-[360px]:max-[800px]:text-lg">
              Chi phí mới
            </h2>
            <CategoryDrawer categories={category} />
          </div>
          <div className="flex w-full">
            <QikLogger categories={category} />
          </div>
        </div>
      </div>
      <div
        className="col-span-9 bg-white rounded-xl px-5 py-4 shadow-qele-panel min-[360px]:max-[800px]:w-full"
      >
        <ExpenseCalendar
          expenses={expenses}
          income={income}
          billing={billing}
          currentUserId={currentUserID as string}
        ></ExpenseCalendar>
      </div>
    </div>
  );
}
