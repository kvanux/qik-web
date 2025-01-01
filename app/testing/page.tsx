import React from "react";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";

const Test = async (request: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session!.user!.email as string },
  });
  const currentUserID = currentUser?.id;
  if (!currentUserID) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const year = 2024;
  const month = 3;

  // Get previous month's balance
  const prevMonth = month - 1;

  const prevBalance = await prisma.monthlyBalance.findUnique({
    where: {
      year_month: { year: year, month: prevMonth },
    },
  });

  // Get current month's transactions
  const startOfMonth = new Date(year, month - 1, 2);
  const endOfMonth = new Date(year, month);

  const [income, expenses, billing] = await Promise.all([
    prisma.income.aggregate({
      where: {
        month: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        userID: currentUserID,
      },
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      where: {
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        userID: currentUserID,
      },
      _sum: { amount: true },
    }),
    prisma.billing.aggregate({
      where: {
        month: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        userID: currentUserID,
      },
      _sum: { amount: true },
    }),
  ]);

  const balance =
    (income._sum.amount || 0) -
    (expenses._sum.amount || 0) -
    (billing._sum.amount || 0) +
    (prevBalance?.balance || 0);

  const print1 = year;
  const print2 = month;
  const print3 = prevBalance?.balance;
  const print4 = startOfMonth.toISOString();
  const print5 = endOfMonth.toISOString();
  const print6 = expenses._sum.amount;
  const print7 = balance;

  return (
    <div className="p-6 flex flex-col gap-3">
      <h1 className="text-xl font-semibold text-qik-sec-900">test</h1>
      <div className="flex gap-1">
        <p className="text-base font-normal text-slate-800">year =</p>
        <p className="text-base font-medium text-qik-sec-700">{print1}</p>
      </div>
      <div className="flex gap-1">
        <p className="text-base font-normal text-slate-800">month =</p>
        <p className="text-base font-medium text-qik-sec-700">{print2}</p>
      </div>
      <div className="flex gap-1">
        <p className="text-base font-normal text-slate-800">prevBalance =</p>
        <p className="text-base font-medium text-qik-sec-700">{print3}</p>
      </div>
      <div className="flex gap-1">
        <p className="text-base font-normal text-slate-800">startOfMonth =</p>
        <p className="text-base font-medium text-qik-sec-700">{print4}</p>
      </div>
      <div className="flex gap-1">
        <p className="text-base font-normal text-slate-800">endOfMonth =</p>
        <p className="text-base font-medium text-qik-sec-700">{print5}</p>
      </div>
      <div className="flex gap-1">
        <p className="text-base font-normal text-slate-800">expenses =</p>
        <p className="text-base font-medium text-qik-sec-700">{print6}</p>
      </div>
      <div className="flex gap-1">
        <p className="text-base font-normal text-slate-800">balance =</p>
        <p className="text-base font-medium text-qik-sec-700">{print7}</p>
      </div>
    </div>
  );
};

export default Test;
