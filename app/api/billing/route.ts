import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request: NextRequest) {
    const billing = await prisma.billing.findMany({});
    return NextResponse.json(billing, {status: 200})
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const amount = parseInt(body.amount, 10);
        const newBilling = await prisma.billing.create({ 
            data: {  amount: amount, 
                month: new Date(body.month), 
                title: body.title || null } 
        })

        const year = newBilling.month.getFullYear();
        const month = newBilling.month.getMonth() + 1;
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
        
        return NextResponse.json(newBilling, {status: 201})
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to log billing' },
            { status: 500 }
          )
    }
}