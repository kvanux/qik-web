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
        
        return NextResponse.json(newBilling, {status: 201})
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to log billing' },
            { status: 500 }
          )
    }
}