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
  testTerm: boolean;
}

interface TestOptions {
  count: number;
  answerType: 'term' | 'definition' | 'both';
  typed: boolean;
  multipleChoice: boolean;
}

export default function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [testCards, setTestCards] = useState<TestCard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testOptions, setTestOptions] = useState<TestOptions>({
    count: 10,
    answerType: 'definition',
    typed: true,
    multipleChoice: true
  });

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
      const type = testOptions.typed && testOptions.multipleChoice 
        ? (Math.random() < 0.5 ? 'fill' as const : 'multiple' as const)
        : testOptions.typed 
          ? 'fill' as const 
          : 'multiple' as const;
      
      let options: string[] | undefined;
      
      // Determine if this card will test term or definition
      const testTerm = testOptions.answerType === 'both' 
        ? Math.random() < 0.5 
        : testOptions.answerType === 'term';
      
      if (type === 'multiple') {
        // Get 3 random incorrect answers
        const otherCards = flashcards.filter(card => card.id !== flashcard.id);
        const shuffledOthers = [...otherCards].sort(() => Math.random() - 0.5);
        const incorrectAnswers = shuffledOthers.slice(0, 3).map(card => 
          testTerm ? card.term || '' : card.definition || ''
        );
        
        // Combine with correct answer and shuffle
        const correctAnswer = testTerm 
          ? flashcard.term || '' 
          : flashcard.definition || '';
        
        options = [...incorrectAnswers, correctAnswer]
          .filter(Boolean)
          .sort(() => Math.random() - 0.5);
      }

      return {
        flashcard,
        type,
        options,
        userAnswer: '',
        isCorrect: false,
        testTerm
      };
    });

    setTestCards(testCards);
  };

  const handleStartTest = (count: number, options: TestOptions) => {
    setTestOptions(options);
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
      const correctAnswer = card.testTerm
        ? card.flashcard.term?.toLowerCase().trim() 
        : card.flashcard.definition?.toLowerCase().trim();
      const userAnswer = card.userAnswer.toLowerCase().trim();
      const isCorrect = userAnswer === correctAnswer;
      
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
            .card { margin-bottom: 20px; }
            .question { font-weight: bold; margin-bottom: 10px; }
            .answer { margin-left: 20px; }
            .results { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ccc; }
          </style>
        </head>
        <body>
          <h1>Flashcard Test</h1>
          ${testCards.map((card, index) => `
            <div class="card">
              <div class="question">${index + 1}. ${card.testTerm ? card.flashcard.definition : card.flashcard.term}</div>
              <div class="answer">${card.userAnswer}</div>
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

  const correctCount = testCards.filter(card => card.isCorrect).length;
  const accuracy = (correctCount / testCards.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
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

      <TestModal
        isOpen={isModalOpen}
        onClose={() => router.push(`/sets/${id}`)}
        onStart={handleStartTest}
        maxCards={flashcards.length}
      />

      {testCards.length > 0 && !isSubmitted && (
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
                        {card.testTerm ? card.flashcard.definition : card.flashcard.term}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {card.testTerm ? 'Enter the term' : 'Enter the definition'}
                      </div>

                      {card.type === 'fill' ? (
                        <div className="space-y-2">
                          <Label htmlFor={`answer-${index}`}>Your answer:</Label>
                          <Input
                            id={`answer-${index}`}
                            value={card.userAnswer}
                            onChange={(e) => handleAnswer(index, e.target.value)}
                            placeholder={card.testTerm ? "Type the term..." : "Type the definition..."}
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
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button onClick={handleSubmit}>
              Submit Test
            </Button>
          </div>
        </div>
      )}

      {isSubmitted && (
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
    </div>
  );
} 