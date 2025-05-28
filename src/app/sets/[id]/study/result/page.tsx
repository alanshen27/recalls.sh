'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ResultPageProps {
  params: {
    id: string;
  };
}

interface CardResult {
  term: string;
  definition: string;
  attempts: number;
  correct: number;
  accuracy: number;
}

export default function ResultPage({ params }: ResultPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const results: CardResult[] = JSON.parse(decodeURIComponent(searchParams.get('results') || '[]'));

  const totalAttempts = results.reduce((sum, card) => sum + card.attempts, 0);
  const totalCorrect = results.reduce((sum, card) => sum + card.correct, 0);
  const overallAccuracy = Math.round((totalCorrect / totalAttempts) * 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold">Study Session Results</h1>
              <div className="space-y-2">
                <p className="text-4xl font-bold">{overallAccuracy}%</p>
                <p className="text-muted-foreground">
                  {totalCorrect} correct out of {totalAttempts} attempts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Term</TableHead>
                <TableHead>Definition</TableHead>
                <TableHead className="text-right">Attempts</TableHead>
                <TableHead className="text-right">Correct</TableHead>
                <TableHead className="text-right">Accuracy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{result.term}</TableCell>
                  <TableCell className="text-muted-foreground">{result.definition}</TableCell>
                  <TableCell className="text-right">{result.attempts}</TableCell>
                  <TableCell className="text-right">{result.correct}</TableCell>
                  <TableCell className="text-right">{result.accuracy}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => router.push(`/sets/${params.id}/study`)}>
            Study Again
          </Button>
          <Button onClick={() => router.push(`/sets/${params.id}`)}>
            Back to Set
          </Button>
        </div>
      </div>
    </div>
  );
} 