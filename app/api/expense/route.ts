import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { z } from "zod";

export async function GET(request: NextRequest) {
    const tasks = await prisma.expense.findMany({});
    return NextResponse.json(tasks, {status: 200})
}

const expenseLogSchema = z.object({
    amount: z.number({
        required_error: "Please input expense amount",
        invalid_type_error: "Expense amount must be a number",
      }),
})

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = expenseLogSchema.safeParse(body);
    if (!validation.success)
        return NextResponse.json(validation.error.errors, {status: 400})
    const newExpense = await prisma.expense.create({
        data: { amount: body.amount, date: body.date }
    })
    return NextResponse.json(newExpense, {status: 201})
}