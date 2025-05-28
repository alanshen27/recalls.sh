import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if the set exists and belongs to the current user
    const set = await prisma.flashcardSet.findFirst({
      where: {
        id: params.id,
        ownerId: session.user.id,
      },
    });

    if (!set) {
      return NextResponse.json(
        { error: "Set not found or you don't have permission to share it" },
        { status: 404 }
      );
    }

    // Find the user to share with
    const userToShareWith = await prisma.user.findUnique({
      where: { email },
    });

    if (!userToShareWith) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if already shared
    const existingShare = await prisma.sharedSet.findUnique({
      where: {
        flashcardSetId_sharedWithId: {
          flashcardSetId: params.id,
          sharedWithId: userToShareWith.id,
        },
      },
    });

    if (existingShare) {
      return NextResponse.json(
        { error: "Set is already shared with this user" },
        { status: 400 }
      );
    }

    // Create the share
    const share = await prisma.sharedSet.create({
      data: {
        flashcardSetId: params.id,
        sharedWithId: userToShareWith.id,
      },
    });

    return NextResponse.json(share);
  } catch (error) {
    console.error('Error sharing set:', error);
    return NextResponse.json(
      { error: 'Failed to share set' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return new NextResponse('User ID is required', { status: 400 });
    }

    // Check if the set exists and belongs to the current user
    const set = await prisma.flashcardSet.findUnique({
      where: { id: params.id },
      select: { ownerId: true },
    });

    if (!set) {
      return new NextResponse('Set not found', { status: 404 });
    }

    if (set.ownerId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Remove the share
    await prisma.sharedSet.delete({
      where: {
        flashcardSetId_sharedWithId: {
          flashcardSetId: params.id,
          sharedWithId: userId,
        },
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error removing share:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 