import React from "react";
import DataDashboard from "@/components/ui/custom/dataDashboard/DataDashboard";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function SummaryPage() {
  const session = await getServerSession(authOptions);
  if (!session) console.log("Session not found");
  const currentUser = await prisma.user.findUnique({
    where: { email: session!.user!.email as string },
  });
  const currentUserID = currentUser?.id;

  const expense = await prisma.expense.findMany({
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
  const balance = await prisma.monthlyBalance.findMany({
    where: { userID: currentUserID },
  });

  return (
    <DataDashboard
      expenses={expense}
      incomes={income}
      billings={billing}
      categories={category}
      balances={balance}
    ></DataDashboard>
  );
}
