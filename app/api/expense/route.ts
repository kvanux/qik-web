import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions/auth";

export async function DELETE(request: NextRequest) {
    try {
        const searchParams = new URL(request.url).searchParams;
        const reqId = parseInt(searchParams.get('id') || '');
    
        if (!reqId) {
            return NextResponse.json(
                { error: 'ID is required' },
                { status: 400 }
            );
        }
    
        const removeExpense = await prisma.expense.delete({
            where: {id: reqId}
        })
    
        return NextResponse.json("Deleted succesfully", {status: 200})
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete expense' },
            { status: 404 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
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

        const body = await request.json();
        const newExpense = await prisma.expense.create({ 
            data: { 
                amount: body.amount, 
                date: body.date, 
                userID: currentUserID,
                categoryID: Number(body.categoryID) || null
            } 
        });

        const year = newExpense.date.getFullYear();
        const month = newExpense.date.getMonth() + 1;
        
        // Get previous month's balance
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;
        
        const prevBalance = await prisma.monthlyBalance.findUnique({
            where: {
                year_month_userID: { year: prevYear, month: prevMonth, userID: currentUserID}
            }
        });

        // Get current month's transactions
        const startOfMonth = new Date(year, month - 1, 2);
        const endOfMonth = new Date(year, month);

        const [income, expenses, billing] = await Promise.all([
            prisma.income.aggregate({
                where: {
                    AND: [
                        {
                            month: {
                                gte: startOfMonth,
                                lte: endOfMonth
                            },
                        },
                        {
                            userID: currentUserID
                        }
                    ]
                },
                _sum: { amount: true }
            }),
            prisma.expense.aggregate({
                where: {
                    AND: [
                        {
                            date: {
                                gte: startOfMonth,
                                lte: endOfMonth
                            },
                        },
                        {
                            userID: currentUserID
                        }
                    ]
                },
                _sum: { amount: true }
            }),
            prisma.billing.aggregate({
                where: {
                    AND: [
                        {
                            month: {
                                gte: startOfMonth,
                                lte: endOfMonth
                            },
                        },
                        {
                            userID: currentUserID
                        }
                    ]
                },
                _sum: { amount: true }
            })
        ]);

        const balance = (income._sum.amount || 0) -
            (expenses._sum.amount || 0) -
            (billing._sum.amount || 0) +
            (prevBalance?.balance || 0);

        await prisma.monthlyBalance.upsert({
            where: {
                year_month_userID: { year: year, month: month, userID: currentUserID}
            },
            update: { balance },
            create: { year: year, month: month, balance, userID: currentUserID }
        });

        return NextResponse.json(newExpense, {status: 201})
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to log expense' },
            { status: 500 }
        );
    }
}