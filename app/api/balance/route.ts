import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request: NextRequest) {
    const searchParams = new URL(request.url).searchParams;
    const year = parseInt(searchParams.get('year') || '');
    const month = parseInt(searchParams.get('month') || '');

    if (!year || !month) {
        return NextResponse.json(
            { error: 'Year and month are required' },
            { status: 400 }
        );
    }

    try {
        // Calculate balance up to the specified month
        const endOfMonth = new Date(year, month, 0);

        const [income, expenses, billing] = await Promise.all([
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

        const balance = (income._sum.amount || 0) -
            (expenses._sum.amount || 0) -
            (billing._sum.amount || 0);

        // Store the calculated balance
        const monthlyBalance = await prisma.monthlyBalance.upsert({
            where: {
                year_month: { year, month }
            },
            update: { balance },
            create: { year, month, balance }
        });

        return NextResponse.json(monthlyBalance, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to calculate balance' },
            { status: 500 }
        );
    }
}