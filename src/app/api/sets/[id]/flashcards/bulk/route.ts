import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Bulk create flashcards for a set
 * @param {NextRequest} request - The incoming HTTP request containing flashcards data
 * @param {Object} params - The route parameters
 * @param {string} params.id - The ID of the flashcard set
 * @param {Object} request.body - The request body
 * @param {string} request.body.flashcards - A stringified JSON array of flashcards
 * @param {Array<{term?: string, definition?: string}>} request.body.flashcards - Each flashcard must have at least one of term or definition
 * @returns {Promise<NextResponse>} A response containing the created flashcards or an error message
 * @throws {Error} If there's an error creating the flashcards
 */

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { flashcards } = await request.json();

    // Validate that flashcards is a string
    if (typeof flashcards !== 'string') {
      return NextResponse.json(
        { error: 'Flashcards must be provided as a stringified JSON' },
        { status: 400 }
      );
    }

    // Parse the stringified JSON
    let parsedFlashcards;
    try {
      parsedFlashcards = JSON.parse(flashcards);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    // Validate that parsedFlashcards is an array
    if (!Array.isArray(parsedFlashcards)) {
      return NextResponse.json(
        { error: 'Flashcards must be an array' },
        { status: 400 }
      );
    }

    // Validate that each flashcard has at least one field
    const invalidCards = parsedFlashcards.filter(
      (card: { term?: string; definition?: string }) =>
        (!card.term || card.term.trim() === '') &&
        (!card.definition || card.definition.trim() === '')
    );

    if (invalidCards.length > 0) {
      return NextResponse.json(
        { error: 'Each flashcard must have at least term or definition' },
        { status: 400 }
      );
    }

    // Create flashcards
    const createdFlashcards = await prisma.flashcard.createMany({
      data: parsedFlashcards.map((card: { term?: string; definition?: string }) => ({
        term: card.term?.trim() || null,
        definition: card.definition?.trim() || null,
        flashcardSetId: params.id,
      })),
    });

    return NextResponse.json(createdFlashcards);
  } catch (error) {
    console.error('Error creating flashcards:', error);
    return NextResponse.json(
      { error: 'Failed to create flashcards' },
      { status: 500 }
    );
  }
} 