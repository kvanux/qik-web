import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request: NextRequest) {
    const income = await prisma.income.findMany({});
    return NextResponse.json(income, {status: 200})
}

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
    
        const removeIncome = await prisma.income.delete({
            where: {id: reqId}
        })
    
        return NextResponse.json("Deleted succesfully", {status: 200})
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete income' },
            { status: 404 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const amount = parseInt(body.amount, 10);
        const newIncome = await prisma.income.create({ 
            data: {  amount: amount, 
                month: new Date(body.month), 
                title: body.title || null } 
        })

        const year = newIncome.month.getFullYear();
        const month = newIncome.month.getMonth() + 1;
        
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
                    }
                },
                _sum: { amount: true }
            }),
            prisma.expense.aggregate({
                where: {
                    date: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    }
                },
                _sum: { amount: true }
            }),
            prisma.billing.aggregate({
                where: {
                    month: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    }
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
                year_month: { year: year, month: month}
            },
            update: { balance },
            create: { year: year, month: month, balance }
        });

        return NextResponse.json(newIncome, {status: 201})
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to log income' },
            { status: 500 }
        );
    }
}