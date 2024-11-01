import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request: NextRequest) {
    const expenses = await prisma.expense.findMany({});
    return NextResponse.json(expenses, {status: 200})
}

// async function updateMonthlyBalance(date: Date, tx: any) {
//     const year = date.getFullYear()
//     const month = date.getMonth() + 1
    
//     const endOfMonth = new Date(year, month, 0)
    
//     const [income, expenses, billing] = await Promise.all([
//       tx.income.aggregate({
//         where: { date: { lte: endOfMonth } },
//         _sum: { amount: true }
//       }),
//       tx.expense.aggregate({
//         where: { date: { lte: endOfMonth } },
//         _sum: { amount: true }
//       }),
//       tx.billing.aggregate({
//         where: { date: { lte: endOfMonth } },
//         _sum: { amount: true }
//       })
//     ])
  
//     const balance = (income._sum.amount || 0) - 
//                    (expenses._sum.amount || 0) - 
//                    (billing._sum.amount || 0)
  
//     await tx.monthlyBalance.upsert({
//       where: { year_month: { year, month } },
//       update: { balance },
//       create: { year, month, balance }
//     })
//   }

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const transaction = await prisma.$transaction(async (tx) => {
            const result = await tx.expense.create({ 
                data: { amount: body.amount, date: body.date } 
            })
            // await updateMonthlyBalance(result.date, tx)
            
            return result
          })
        return NextResponse.json(transaction, {status: 201})
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to log expense' },
            { status: 500 }
          )
    }
}