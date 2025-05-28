import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "mine";

    if (type === "shared") {
      // Get sets that are shared with the user
      const sharedSets = await prisma.sharedSet.findMany({
        where: {
          sharedWithId: session.user.id
        },
        include: {
          flashcardSet: {
            include: {
              flashcards: true,
              owner: {
                select: {
                  name: true,
                  email: true,
                  image: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Transform the data to match the expected format
      const sets = sharedSets.map(shared => ({
        ...shared.flashcardSet,
        owner: shared.flashcardSet.owner
      }));

      return NextResponse.json(sets);
    } else {
      // "mine": sets owned by the user
      const sets = await prisma.flashcardSet.findMany({
        where: { ownerId: session.user.id },
        include: {
          flashcards: true,
          owner: {
            select: {
              name: true,
              email: true,
              image: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });
      return NextResponse.json(sets);
    }
  } catch (error) {
    console.error('Error in GET /api/sets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title, description, labels } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const set = await prisma.flashcardSet.create({
      data: {
        title,
        description: description || null,
        labels: labels || null,
        ownerId: session.user.id,
      },
      include: {
        flashcards: true,
        owner: {
          select: {
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json(set);
  } catch (error) {
    console.error('Error in POST /api/sets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 