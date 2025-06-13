import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {prisma} from '@/lib/prisma';

// GET /api/worksheets/[id] - Get a single worksheet
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const worksheet = await prisma.worksheet.findUnique({
      where: { id: params.id },
      include: {
        questions: true,
      },
    });

    if (!worksheet) {
      return NextResponse.json({ error: 'Worksheet not found' }, { status: 404 });
    }

    return NextResponse.json(worksheet);
  } catch (error) {
    console.error('Error fetching worksheet:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/worksheets/[id] - Update a worksheet
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title } = body;

    // First delete existing contents
    await prisma.question.deleteMany({
      where: { worksheetId: params.id },
    });

    const worksheet = await prisma.worksheet.update({
      where: { id: params.id },
      data: {
        title,
        userId: session.user.id,
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json(worksheet);
  } catch (error) {
    console.error('Error updating worksheet:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/worksheets/[id] - Delete a worksheet
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.worksheet.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting worksheet:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 