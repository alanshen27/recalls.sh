'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TestModal } from '@/components/ui/test-modal';
import { ArrowLeft, Printer } from 'lucide-react';
import { Loading } from "@/components/ui/loading";

interface Flashcard {
  id: string;
  term: string | null;
  definition: string | null;
}

interface TestCard {
  flashcard: Flashcard;
  type: 'fill' | 'multiple';
  options?: string[];
  userAnswer: string;
  isCorrect: boolean;
}

export default function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [testCards, setTestCards] = useState<TestCard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { id } = use(params);

  useEffect(() => {
    fetchFlashcards();
  }, [id]);

  const fetchFlashcards = async () => {
    try {
      const response = await fetch(`/api/sets/${id}/flashcards`);
      if (!response.ok) throw new Error('Failed to fetch flashcards');
      const data = await response.json();
      setFlashcards(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      setIsLoading(false);
    }
  };

  const generateTestCards = (count: number) => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);
    
    const testCards = selected.map(flashcard => {
      const type = Math.random() < 0.5 ? 'fill' as const : 'multiple' as const;
      let options: string[] | undefined;
      
      if (type === 'multiple') {
        // Get 3 random incorrect answers
        const otherCards = flashcards.filter(card => card.id !== flashcard.id);
        const shuffledOthers = [...otherCards].sort(() => Math.random() - 0.5);
        const incorrectAnswers = shuffledOthers.slice(0, 3).map(card => card.definition || '');
        
        // Combine with correct answer and shuffle
        options = [...incorrectAnswers, flashcard.definition || '']
          .filter(Boolean)
          .sort(() => Math.random() - 0.5);
      }

      return {
        flashcard,
        type,
        options,
        userAnswer: '',
        isCorrect: false,
      };
    });

    setTestCards(testCards);
  };

  const handleStartTest = (count: number) => {
    generateTestCards(count);
    setIsModalOpen(false);
  };

  const handleAnswer = (index: number, answer: string) => {
    setTestCards(prev => prev.map((card, i) => 
      i === index 
        ? { ...card, userAnswer: answer }
        : card
    ));
  };

  const handleSubmit = () => {
    const results = testCards.map(card => {
      const isCorrect = card.userAnswer.toLowerCase().trim() === 
        (card.type === 'fill' ? card.flashcard.definition?.toLowerCase().trim() : 
         card.flashcard.definition?.toLowerCase().trim());
      
      return {
        ...card,
        isCorrect
      };
    });

    setTestCards(results);
    setIsSubmitted(true);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <html>
        <head>
          <title>Flashcard Test</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .test-header { text-align: center; margin-bottom: 30px; }
            .question { margin-bottom: 20px; }
            .question-number { font-weight: bold; }
            .term { font-size: 1.2em; margin: 10px 0; }
            .answer-space { border-bottom: 1px solid black; min-height: 20px; margin: 10px 0; }
            .multiple-choice { margin-left: 20px; }
            .multiple-choice div { margin: 5px 0; }
            .results { margin-top: 30px; padding: 20px; border: 1px solid #ccc; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="test-header">
            <h1>Flashcard Test</h1>
            ${isSubmitted ? `<h2>Test Results</h2>` : ''}
          </div>
          
          ${testCards.map((card, index) => `
            <div class="question">
              <div class="question-number">${index + 1}.</div>
              <div class="term">${card.flashcard.term}</div>
              ${card.type === 'fill' ? 
                `<div class="answer-space"></div>` :
                `<div class="multiple-choice">
                  ${card.options?.map((option, optionIndex) => `
                    <div>${String.fromCharCode(65 + optionIndex)}. ${option}</div>
                  `).join('')}
                </div>`
              }
              ${isSubmitted ? `
                <div class="results">
                  <div>Your answer: ${card.userAnswer}</div>
                  <div>Correct answer: ${card.flashcard.definition}</div>
                  <div>${card.isCorrect ? '✓ Correct' : '✗ Incorrect'}</div>
                </div>
              ` : ''}
            </div>
          `).join('')}
          
          ${isSubmitted ? `
            <div class="results">
              <h3>Summary</h3>
              <p>Score: ${correctCount} / ${testCards.length}</p>
              <p>Accuracy: ${accuracy.toFixed(1)}%</p>
            </div>
          ` : ''}
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isModalOpen) {
    return (
      <TestModal
        isOpen={isModalOpen}
        onClose={() => router.back()}
        onStart={handleStartTest}
        maxCards={flashcards.length}
      />
    );
  }

  const correctCount = testCards.filter(card => card.isCorrect).length;
  const accuracy = (correctCount / testCards.length) * 100;

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          variant="outline"
          onClick={handlePrint}
          className="no-print"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print {isSubmitted ? 'Results' : 'Test'}
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Flashcard Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {testCards.map((card, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-start gap-2">
                  <span className="font-medium">{index + 1}.</span>
                  <div className="space-y-4 flex-1">
                    <div className="text-lg font-semibold">
                      {card.flashcard.term}
                    </div>

                    {card.type === 'fill' ? (
                      <div className="space-y-2">
                        <Label htmlFor={`answer-${index}`}>Your answer:</Label>
                        <Input
                          id={`answer-${index}`}
                          value={card.userAnswer}
                          onChange={(e) => handleAnswer(index, e.target.value)}
                          placeholder="Type your answer..."
                          disabled={isSubmitted}
                        />
                      </div>
                    ) : (
                      <RadioGroup
                        value={card.userAnswer}
                        onValueChange={(value) => handleAnswer(index, value)}
                        disabled={isSubmitted}
                        className="space-y-2"
                      >
                        {card.options?.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`option-${index}-${optionIndex}`} />
                            <Label htmlFor={`option-${index}-${optionIndex}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}

                    {isSubmitted && (
                      <div className={`p-3 rounded-md ${card.isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        <div className="font-medium">
                          {card.isCorrect ? 'Correct!' : 'Incorrect'}
                        </div>
                        <div className="text-sm">
                          Correct answer: {card.flashcard.definition}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {!isSubmitted ? (
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={testCards.some(card => !card.userAnswer)}
              >
                Submit Test
              </Button>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Test Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Score</p>
                        <p className="text-2xl font-bold">{correctCount} / {testCards.length}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                        <p className="text-2xl font-bold">{accuracy.toFixed(1)}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/sets/${id}`)}
                  >
                    Back to Set
                  </Button>
                  <Button
                    onClick={() => router.push(`/sets/${id}/test`)}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 