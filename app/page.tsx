import QikLogger from "@/components/ui/custom/qikLogger/QikLogger";
import ExpenseCalendar from "@/components/ui/custom/expenseCalendar/expenseCalendar";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";

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
      id="container"
      className="grid grid-cols-12 gap-6 w-full max-w-[1840px] self-center"
    >
      <div
        id="panel-layout-3"
        className="col-span-3 bg-white rounded-xl px-5 pt-4 pb-6 h-fit shadow-qele-panel"
      >
        <div id="section-Logger" className="flex flex-col gap-4 w-full">
          <div
            id="sectionTitle-Logger"
            className="w-full flex h-10 items-center"
          >
            <h2 className="text-xl font-semibold text-neutral-800 w-full">
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
        className="col-span-9 bg-white rounded-xl px-5 py-4 shadow-qele-panel"
      >
        <ExpenseCalendar
          expenses={expenses}
          income={income}
          billing={billing}
        ></ExpenseCalendar>
      </div>
    </div>
  );
}
