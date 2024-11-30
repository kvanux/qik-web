import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
    const searchParams = new URL(request.url).searchParams;
    const year = parseInt(searchParams.get('year') || '');
    const month = parseInt(searchParams.get('month') || '');

    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }
    
    const currentUser = await prisma.user.findUnique({
        where: {email: session!.user!.email as string}
    })
    const currentUserID = currentUser?.id
    if (!currentUserID) {
        return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
        );
    }

    if (!year || !month) {
        return NextResponse.json(
            { error: 'Year and month are required' },
            { status: 400 }
        );
    }

    try {
        // Get previous month's balance
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;
        
        const prevBalance = await prisma.monthlyBalance.findUnique({
            where: {
                year_month: { year: prevYear, month: prevMonth }
            }
        });

        // Get current month's transactions
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0);

        const [income, expenses, billing] = await Promise.all([
            prisma.income.aggregate({
                where: {
                    month: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    },
                    userID: currentUserID
                },
                _sum: { amount: true }
            }),
            prisma.expense.aggregate({
                where: {
                    date: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    },
                    userID: currentUserID
                },
                _sum: { amount: true }
            }),
            prisma.billing.aggregate({
                where: {
                    month: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    },
                    userID: currentUserID
                },
                _sum: { amount: true }
            })
        ]);

        const balance = (income._sum.amount || 0) -
            (expenses._sum.amount || 0) -
            (billing._sum.amount || 0) +
            (prevBalance?.balance || 0);

        const monthlyBalance = await prisma.monthlyBalance.upsert({
            where: {
                year_month: { year: year, month: month}
            },
            update: { balance },
            create: { year: year, month: month, balance, userID: currentUserID as string }
        });

        return NextResponse.json(monthlyBalance, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to calculate balance' },
            { status: 500 }
        );
    }
}