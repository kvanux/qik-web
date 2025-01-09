import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions/auth"

export async function GET(request: NextRequest) {
    try {
        const feedbacks = await prisma.feedback.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
        return NextResponse.json(feedbacks, {status: 200})
    } catch (error) {
        return NextResponse.json({error: 'Unable to get feedbacks list'}, {status: 400})
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

        const newFeedback = await prisma.feedback.create({
            data: {
                content: body.content,
                userID: currentUserID
            }
        })
        
        return NextResponse.json(newFeedback, {status: 201})
    } catch (error) {
        return NextResponse.json(
            {error: 'Failed to send feedback'},
            {status: 500}
        )
    }
}