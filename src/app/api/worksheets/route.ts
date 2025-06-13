import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {prisma} from '@/lib/prisma';

// GET /api/worksheets - Get all worksheets
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const worksheets = await prisma.worksheet.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        questions: {
          include: {
            blocks: true
          }
        }
      },
    });

    return NextResponse.json(worksheets);
  } catch (error) {
    console.error('Error fetching worksheets:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/worksheets - Create a new worksheet
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, questions } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const worksheet = await prisma.worksheet.create({
      data: {
        title,
        description,
        userId: session.user.id,
        questions: {
          create: questions?.map((q: { blocks: { content: string; type: string; expectedAnswer: string }[] }, index: number) => ({
            order: index,
            blocks: {
              create: q.blocks?.map((b: { content: string; type: string; expectedAnswer: string }, blockIndex: number) => ({
                content: b.content,
                type: b.type || 'text',
                expectedAnswer: b.expectedAnswer,
                order: blockIndex
              }))
            }
          })) || []
        }
      },
      include: {
        questions: {
          include: {
            blocks: true
          }
        }
      },
    });

    return NextResponse.json(worksheet);
  } catch (error) {
    console.error('Error creating worksheet:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 