import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const set = await prisma.flashcardSet.findUnique({
      where: {
        id: params.id,
      },
      include: {
        flashcards: true,
        sharedWith: {
          include: {
            sharedWith: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!set) {
      return new NextResponse('Set not found', { status: 404 });
    }

    // Check if user has access to this set
    const hasAccess = set.ownerId === session.user.id || 
      set.sharedWith.some((share: { sharedWithId: string }) => share.sharedWithId === session.user.id);

    if (!hasAccess) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    return NextResponse.json(set);
  } catch (error) {
    console.error('Error fetching set:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { title, description, labels } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const set = await prisma.flashcardSet.update({
      where: { id: params.id },
      data: {
        title,
        description: description || null,
        labels: labels || null,
      },
    });

    return NextResponse.json(set);
  } catch (error) {
    console.error('Error updating set:', error);
    return NextResponse.json(
      { error: 'Failed to update set' },
      { status: 500 }
    );
  }
} 