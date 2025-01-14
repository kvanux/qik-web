import React from "react";
import DataDashboard from "@/components/ui/custom/dataDashboard/DataDashboard";
import prisma from "@/prisma/client";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { UserType } from "@/types/supabase";

export default async function SummaryPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const currentUser = session?.user as UserType;
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
