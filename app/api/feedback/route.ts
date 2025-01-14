import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { UserType } from '@/types/supabase';

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
        const supabase = createRouteHandlerClient({ cookies })
  
        const { data: { session } } = await supabase.auth.getSession()
        const currentUser = session?.user as UserType
        
        if (!currentUser) {
            return new Response('Unauthorized', { status: 401 })
        }
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