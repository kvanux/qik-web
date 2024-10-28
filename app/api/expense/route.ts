import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request: NextRequest) {
    const tasks = await prisma.expense.findMany({});
    return NextResponse.json(tasks, {status: 200})
}