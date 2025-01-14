import QikLogger from "@/components/ui/custom/qikLogger/QikLogger";
import ExpenseCalendar from "@/components/ui/custom/expenseCalendar/expenseCalendar";
import prisma from "@/prisma/client";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { UserType } from "@/types/supabase";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const currentUser = session?.user as UserType;
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
      id="container"
      className="grid grid-cols-12 gap-6 w-full max-w-[1840px] self-center min-[360px]:max-[800px]:flex min-[360px]:max-[800px]:flex-col min-[360px]:max-[800px]:gap-4"
    >
      <div
        id="panel-layout-3"
        className="col-span-3 bg-white rounded-xl px-5 pt-4 pb-6 h-fit shadow-qele-panel min-[360px]:max-[800px]:w-full"
      >
        <div id="section-Logger" className="flex flex-col gap-4 w-full">
          <div id="sectionTitle-Logger" className="w-full flex items-center">
            <h2 className="text-xl font-semibold text-slate-800 w-full min-[360px]:max-[800px]:text-lg">
              Chi phí mới
            </h2>
            <div id="interactGroup-Logger" className="flex gap-2"></div>
          </div>
          <div id="sectionContent-Logger" className="flex w-full">
            <QikLogger categories={category} />
          </div>
        </div>
      </div>
      <div
        id="panel-layout-9"
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
