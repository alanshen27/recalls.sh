import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Flashcard {
  id?: string;
  term?: string | null;
  definition?: string | null;
  flashcardSetId: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const flashcards = await prisma.flashcard.findMany({
      where: {
        flashcardSetId: id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(flashcards);
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flashcards' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { term, definition } = await request.json();

    const flashcard = await prisma.flashcard.create({
      data: {
        term: term?.trim() || null,
        definition: definition?.trim() || null,
        flashcardSetId: id,
      },
    });

    return NextResponse.json(flashcard);
  } catch (error) {
    console.error('Error creating flashcard:', error);
    return NextResponse.json(
      { error: 'Failed to create flashcard' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const flashcards = await request.json() as Flashcard[];

    // Get existing flashcards
    const existingFlashcards = await prisma.flashcard.findMany({
      where: {
        flashcardSetId: id,
      },
    });

    // Separate flashcards into updates and creates
    const updates = flashcards.filter((card) => card.id && !card.id.startsWith('temp_'));
    const creates = flashcards.filter((card) => !card.id || card.id.startsWith('temp_'));

    // Update existing flashcards
    const updatePromises = updates.map((card) =>
      prisma.flashcard.update({
        where: { id: card.id! },
        data: {
          term: card.term?.trim() || null,
          definition: card.definition?.trim() || null,
        },
      })
    );

    // Create new flashcards
    const createPromises = creates.map((card) =>
      prisma.flashcard.create({
        data: {
          term: card.term?.trim() || null,
          definition: card.definition?.trim() || null,
          flashcardSetId: id,
        },
      })
    );

    // Delete flashcards that are no longer present
    const existingIds = existingFlashcards.map(f => f.id);
    const newIds = updates.map(f => f.id!);
    const toDelete = existingIds.filter(id => !newIds.includes(id));

    const deletePromise = prisma.flashcard.deleteMany({
      where: {
        id: { in: toDelete },
      },
    });

    // Execute all operations
    await Promise.all([
      Promise.all(updatePromises),
      Promise.all(createPromises),
      deletePromise,
    ]);

    // Return all flashcards in the set
    const result = await prisma.flashcard.findMany({
      where: {
        flashcardSetId: id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating flashcards:', error);
    return NextResponse.json(
      { error: 'Failed to update flashcards' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.flashcard.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    return NextResponse.json(
      { error: 'Failed to delete flashcard' },
      { status: 500 }
    );
  }
} 