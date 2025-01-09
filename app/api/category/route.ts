import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions/auth"

export async function GET(request: NextRequest) {
    try {
        const categories = await prisma.category.findMany({})
        return NextResponse.json(categories, {status: 200})
    } catch (error) {
        return NextResponse.json({error: 'Unable to get categories'}, {status: 400})
    }
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
    
        const removeCategory = await prisma.category.delete({
            where: {id: reqId}
        })
    
        return NextResponse.json("Deleted succesfully", {status: 200})
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete category' },
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

        const newCategory = await prisma.category.create({
            data: {
                title: body.title,
                userID: currentUserID
            }
        })
        
        return NextResponse.json(newCategory, {status: 201})
    } catch (error) {
        return NextResponse.json(
            {error: 'Failed to create category'},
            {status: 500}
        )
    }
}