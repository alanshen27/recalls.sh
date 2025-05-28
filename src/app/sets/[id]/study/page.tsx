'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Flashcard } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { TestModal } from '@/components/ui/study-modal';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Loading } from "@/components/ui/loading";

interface TestPageProps {
  params: Promise<{ id: string }>;
}

interface CardPerformance {
  card: Flashcard;
  attempts: number;
  correct: number;
  userAnswer: string;
  isMultipleChoice: boolean;
  selectedOption?: string;
}

export default function TestPage({ params }: TestPageProps) {
  const router = useRouter();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [studyCards, setStudyCards] = useState<CardPerformance[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<string[]>([]);

  const { id } = use(params);
  
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await fetch(`/api/sets/${id}/flashcards`);
        if (!response.ok) throw new Error('Failed to fetch flashcards');
        const data = await response.json();
        setFlashcards(data);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashcards();
  }, [id]);

  const generateMultipleChoiceOptions = (correctAnswer: string, allDefinitions: string[]) => {
    // Get 3 random incorrect answers
    const incorrectOptions = allDefinitions
      .filter(def => def !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    // Combine with correct answer and shuffle
    const options = [...incorrectOptions, correctAnswer]
      .sort(() => Math.random() - 0.5);
    
    return options;
  };

  const handleStartTest = (count: number) => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    const selectedCards = shuffled.slice(0, count);
    const allDefinitions = flashcards.map(card => card.definition);
    
    setStudyCards(selectedCards.map(card => {
      const isMultipleChoice = Math.random() < 0.5; // 50% chance for multiple choice
      return {
        card,
        attempts: 0,
        correct: 0,
        userAnswer: '',
        isMultipleChoice
      };
    }));
    
    // Generate multiple choice options for the first card
    const firstCard = selectedCards[0];
    
    setMultipleChoiceOptions(generateMultipleChoiceOptions(firstCard.definition, allDefinitions));
    
    setCurrentIndex(0);
    setUserAnswer('');
    setShowFeedback(false);
    setIsModalOpen(false);
  };

  const checkAnswer = (selectedAnswer?: string) => {
    const currentCard = studyCards[currentIndex];
    const answerToCheck = selectedAnswer || userAnswer;
    const normalizedUserAnswer = answerToCheck.trim().toLowerCase();
    const normalizedCorrectAnswer = currentCard.card.definition.trim().toLowerCase();
    const isAnswerCorrect = normalizedUserAnswer === normalizedCorrectAnswer;

    setStudyCards(prev => {
      const newCards = [...prev];
      const currentCard = newCards[currentIndex];
      currentCard.attempts++;
      if (isAnswerCorrect) {
        currentCard.correct++;
      }
      currentCard.userAnswer = answerToCheck;
      currentCard.selectedOption = selectedAnswer;
      return newCards;
    });

    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);
    if (selectedAnswer) {
      setUserAnswer(selectedAnswer);
    }
  };

  const handleNext = () => {
    // If all cards have been answered correctly at least once, end the session
    const allCorrect = studyCards.every(card => card.correct > 0);
    if (allCorrect) {
      const results = studyCards.map(card => ({
        term: card.card.term,
        definition: card.card.definition,
        userAnswer: card.userAnswer,
        attempts: card.attempts,
        correct: card.correct,
        accuracy: Math.round((card.correct / card.attempts) * 100)
      }));
      router.push(`/sets/${id}/study/result?results=${encodeURIComponent(JSON.stringify(results))}`);
      return;
    }

    // reset the selectedOption for the current card
    setStudyCards(prev => {
      const newCards = [...prev];
      newCards[currentIndex].selectedOption = undefined;
      return newCards;
    });

    // Move to next card or back to the beginning
    if (currentIndex < studyCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // If we've gone through all cards, start over with the ones that haven't been answered correctly
      const remainingCards = studyCards.filter(card => card.correct === 0);
      if (remainingCards.length > 0) {
        setCurrentIndex(studyCards.indexOf(remainingCards[0]));
      }
    }

    // Generate multiple choice options for the next card if it's multiple choice
    const nextCard = studyCards[currentIndex + 1];
    if (nextCard?.isMultipleChoice) {
      const allDefinitions = flashcards.map(card => card.definition);
      setMultipleChoiceOptions(generateMultipleChoiceOptions(nextCard.card.definition, allDefinitions));
    }

    setUserAnswer('');
    setShowFeedback(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !showFeedback) {
      checkAnswer();
    } else if (e.key === 'Enter' && showFeedback) {
      handleNext();
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (flashcards.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No flashcards found in this set.</p>
            <Button onClick={() => router.push(`/sets/${id}`)}>
              Back to Set
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const masteredCards = studyCards.filter(card => card.correct > 0).length;
  const progress = (masteredCards / studyCards.length) * 100;
  const currentCard = studyCards[currentIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <TestModal
        isOpen={isModalOpen}
        onClose={() => router.push(`/sets/${id}`)}
        onStart={handleStartTest}
        maxCards={flashcards.length}
      />

      {studyCards.length > 0 && (
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{masteredCards} of {studyCards.length} cards mastered</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Current Card: {currentIndex + 1} of {studyCards.length}
              </p>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <p className="text-lg font-medium">
                  {currentCard.card.term}
                </p>
                <div className="space-y-4">
                  {currentCard.isMultipleChoice ? (
                    <div className="grid grid-cols-2 gap-4">
                      {multipleChoiceOptions.map((option, index) => {
                        const isSelected = userAnswer === option;
                        const isCorrectAnswer = option === currentCard.card.definition;
                        const showFeedback = currentCard.selectedOption === option;
                        
                        const buttonVariant = "outline" as const;
                        let buttonClassName = "h-auto py-4 px-4 text-base whitespace-normal text-left";
                        
                        if (showFeedback) {
                          if (isCorrectAnswer) {
                            buttonClassName += " border-green-500 bg-green-100 text-green-500 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950";
                          } else {
                            buttonClassName += " border-red-500 bg-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950";
                          }
                        } else if (isSelected) {
                          buttonClassName += " border-primary";
                        }

                        return (
                          <Button
                            key={index}
                            variant={buttonVariant}
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              e.preventDefault();
                              if (!showFeedback) {
                                checkAnswer(option);
                              }
                            }}
                            disabled={showFeedback}
                            className={buttonClassName}
                          >
                            {option}
                          </Button>
                        );
                      })}
                    </div>
                  ) : (
                    <Input
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your answer..."
                      disabled={showFeedback}
                      className="text-base"
                    />
                  )}
                  {showFeedback && !currentCard.isMultipleChoice && (
                    <div className={`p-4 rounded-md ${isCorrect ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
                      <p className="font-medium mb-2">
                        {isCorrect ? 'Correct!' : 'Incorrect'}
                      </p>
                      <p className="text-muted-foreground">
                        Correct answer: {currentCard.card.definition}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            {!showFeedback ? (
              <Button 
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  checkAnswer();
                }}
                disabled={!userAnswer}
              >
                Check Answer
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next Card
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 