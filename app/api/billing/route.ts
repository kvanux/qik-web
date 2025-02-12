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
    
        const removeBilling = await prisma.billing.delete({
            where: {id: reqId}
        })
    
        return NextResponse.json("Deleted succesfully", {status: 200})
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete billing' },
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
        const amount = parseInt(body.amount, 10);
        const newBilling = await prisma.billing.create({ 
            data: {  amount: amount, 
                month: new Date(body.month), 
                title: body.title || null,
                userID: currentUserID
            } 
        })

        const year = newBilling.month.getFullYear();
        const month = newBilling.month.getMonth() + 1;
        
        // Get previous month's balance
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;
        
        const prevBalance = await prisma.monthlyBalance.findUnique({
            where: {
                year_month_userID: { year: prevYear, month: prevMonth, userID: currentUserID}
            }
        });

        // Get current month's transactions
        const startOfMonth = new Date(Date.UTC(year, month - 1, 1));
        const endOfMonth = new Date(Date.UTC(year, month, 0)); 

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

        return NextResponse.json(newBilling, {status: 201})
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to log billing' },
            { status: 500 }
        );
    }
}