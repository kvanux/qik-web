import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request: NextRequest) {
    const expenses = await prisma.expense.findMany({});
    return NextResponse.json(expenses, {status: 200})
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const newExpense = await prisma.expense.create({ 
                data: { amount: body.amount, date: body.date } 
            })
        
            const year = newExpense.date.getFullYear();
        const month = newExpense.date.getMonth() + 1;
        const endOfMonth = new Date(year, month, 0);

        const [incomeSum, expensesSum, billingSum] = await Promise.all([
            prisma.income.aggregate({
                where: { month: { lte: endOfMonth } },
                _sum: { amount: true }
            }),
            prisma.expense.aggregate({
                where: { date: { lte: endOfMonth } },
                _sum: { amount: true }
            }),
            prisma.billing.aggregate({
                where: { month: { lte: endOfMonth } },
                _sum: { amount: true }
            })
        ]);

        const balance = (incomeSum._sum.amount || 0) -
            (expensesSum._sum.amount || 0) -
            (billingSum._sum.amount || 0);

        await prisma.monthlyBalance.upsert({
            where: {
                year_month: { year, month }
            },
            update: { balance },
            create: { year, month, balance }
        });

        return NextResponse.json(newExpense, {status: 201})
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to log expense' },
            { status: 500 }
          )
    }
}