import prisma from "@/prisma/client"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const url = new URL(req.url)
    const year = parseInt(url.searchParams.get('year') || '')
    const month = parseInt(url.searchParams.get('month') || '')
  
    try {
      const balances = await prisma.monthlyBalance.findMany({
        where: {
          OR: [
            { year: { lt: year } },
            {
              AND: [
                { year: year },
                { month: { lte: month } }
              ]
            }
          ]
        },
        orderBy: [
          { year: 'asc' },
          { month: 'asc' }
        ]
      })
  
      const leftover = balances.reduce((sum, balance) => sum + balance.balance, 0)
  
      return NextResponse.json({ leftover })
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch balance' },
        { status: 500 }
      )
    }
  }