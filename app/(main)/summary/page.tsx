export const dynamic = "force-dynamic";

import React from "react";
import DataDashboard from "@/components/ui/custom/dataDashboard/DataDashboard";
import prisma from "@/prisma/client";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { UserType } from "@/types/supabase";

export default async function SummaryPage() {
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
      const [expense, income, billing, category, balance] = await Promise.all([
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
        prisma.monthlyBalance.findMany({
          where: { userID: currentUserID },
        }),
      ]);

      return (
        <DataDashboard
          expenses={expense}
          incomes={income}
          billings={billing}
          categories={category}
          balances={balance}
        />
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
