'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { use } from 'react';

interface TestResult {
  term: string | null;
  definition: string | null;
  userAnswer: string;
  isCorrect: boolean;
}

export default function TestResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const results: TestResult[] = JSON.parse(decodeURIComponent(searchParams.get('results') || '[]'));

  const correctCount = results.filter(result => result.isCorrect).length;
  const accuracy = (correctCount / results.length) * 100;

  return (
    <div className="container max-w-4xl py-8">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-2xl font-bold">{correctCount} / {results.length}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-2xl font-bold">{accuracy.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Term</TableHead>
                  <TableHead>Correct Answer</TableHead>
                  <TableHead>Your Answer</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{result.term}</TableCell>
                    <TableCell>{result.definition}</TableCell>
                    <TableCell>{result.userAnswer}</TableCell>
                    <TableCell>
                      {result.isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
    </div>
  );
} 