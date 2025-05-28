'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { FlashcardSet, Flashcard, User } from '@prisma/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ChevronLeft, ChevronRight, Edit, BookOpen, ClipboardCheck, Users, X } from "lucide-react";
import Link from 'next/link';
import { ShareSetDialog } from "@/components/share-set-dialog";
import { Loading } from "@/components/ui/loading";
import { toast } from "sonner";

interface SetWithRelations extends FlashcardSet {
  flashcards: Flashcard[];
  sharedWith: {
    sharedWith: User;
  }[];
}

export default function SetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [set, setSet] = useState<SetWithRelations | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studyMode, setStudyMode] = useState<'term' | 'definition'>('term');
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  useEffect(() => {
    const fetchSet = async () => {
      try {
        const response = await fetch(`/api/sets/${id}`);
        if (!response.ok) throw new Error('Failed to fetch set');
        const data = await response.json();
        setSet(data);
      } catch (error) {
        console.error('Error fetching set:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSet();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setStudyMode(prev => prev === 'term' ? 'definition' : 'term');
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
        setStudyMode('term');
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setCurrentIndex(prev => (prev < (set?.flashcards.length || 0) - 1 ? prev + 1 : prev));
        setStudyMode('term');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [set?.flashcards.length]);

  const handleRemoveShare = async (userId: string) => {
    setIsRemoving(userId);
    try {
      const response = await fetch(`/api/sets/${id}/share?userId=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove share');

      // Update the local state
      setSet(prev => {
        if (!prev) return null;
        return {
          ...prev,
          sharedWith: prev.sharedWith.filter(share => share.sharedWith.id !== userId),
        };
      });

      toast.success('User removed from shared list');
    } catch (error) {
      console.error('Error removing share:', error);
      toast.error('Failed to remove user from shared list');
    } finally {
      setIsRemoving(null);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!set) {
    return <div className="p-8">Set not found</div>;
  }

  const currentFlashcard = set.flashcards[currentIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-8"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{set.title}</h1>
          {set.description && (
            <p className="text-muted-foreground">{set.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" asChild>
            <Link href={`/sets/${id}/study`}>
              <BookOpen className="h-4 w-4 mr-2" />
              Study
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/sets/${id}/test`}>
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Test
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/sets/${id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Set
            </Link>
          </Button>
          <ShareSetDialog setId={id} title={set.title} />
        </div>

        {set.sharedWith.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Shared With</h3>
              </div>
              <div className="space-y-2">
                {set.sharedWith.map((share) => (
                  <div key={share.sharedWith.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {share.sharedWith.name || share.sharedWith.email}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRemoveShare(share.sharedWith.id)}
                      disabled={isRemoving === share.sharedWith.id}
                    >
                      {isRemoving === share.sharedWith.id ? (
                        <Loading variant="inline" className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card
          className="cursor-pointer transition-all duration-500 hover:shadow-lg"
          onClick={() => setStudyMode(prev => prev === 'term' ? 'definition' : 'term')}
        >
          <CardContent className="pt-6">
            {
              set.flashcards.length > 0 ? (
                <div
                  className="min-h-[300px] flex items-center justify-center text-2xl text-center relative"
                  style={{
                    transform: `rotateY(${studyMode === 'term' ? '0deg' : '180deg'})`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.5s',
                  }}
                >
                  <div
                    className="absolute w-full h-full flex items-center justify-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(0deg)',
                    }}
                  >
                    {currentFlashcard.term}
                  </div>
                  <div
                    className="absolute w-full h-full flex items-center justify-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    {currentFlashcard.definition}
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  No flashcards in this set yet.
                </div>
              )
            }
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
              setStudyMode('term');
            }}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="text-muted-foreground">
            {currentIndex + 1} of {set.flashcards.length}
          </div>

          <Button
            variant="outline"
            onClick={() => {
              setCurrentIndex(prev => (prev < set.flashcards.length - 1 ? prev + 1 : prev));
              setStudyMode('term');
            }}
            disabled={currentIndex === set.flashcards.length - 1}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Press Space to flip • Arrow keys to navigate</p>
        </div>
      </div>
    </div>
  );
} 