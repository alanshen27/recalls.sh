export interface Flashcard {
    id: string;
    term: string | null;
    definition: string | null;
  }
  
export interface Set {
    id: string;
    title: string;
    description: string | null;
    flashcards: Flashcard[];
  }