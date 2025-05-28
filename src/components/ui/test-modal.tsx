import { useState } from 'react';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './dialog';
import { Input } from './input';
import { Label } from './label';
import { Checkbox } from './checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (count: number, options: TestOptions) => void;
  maxCards: number;
}

interface TestOptions {
  count: number;
  answerType: 'term' | 'definition' | 'both';
  typed: boolean;
  multipleChoice: boolean;
}

export function TestModal({ isOpen, onClose, onStart, maxCards }: TestModalProps) {
  const [count, setCount] = useState(10);
  const [answerType, setAnswerType] = useState<'term' | 'definition' | 'both'>('both');
  const [typed, setTyped] = useState(true);
  const [multipleChoice, setMultipleChoice] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(count, {
      count,
      answerType,
      typed,
      multipleChoice
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Test Options</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="count">Number of cards:</Label>
              <Input
                id="count"
                type="number"
                min={1}
                max={maxCards}
                value={count}
                onChange={(e) => setCount(Math.min(parseInt(e.target.value) || 1, maxCards))}
                className="w-[180px]"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Maximum {maxCards} cards available
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="answerType">Test type:</Label>
              <Select
                value={answerType}
                onValueChange={(value: 'term' | 'definition' | 'both') => setAnswerType(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="term">Terms</SelectItem>
                  <SelectItem value="definition">Definitions</SelectItem>
                  <SelectItem value="both">Both Terms & Definitions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="typed">Allow typed answers:</Label>
              <Checkbox
                id="typed"
                checked={typed}
                onCheckedChange={(checked) => setTyped(checked as boolean)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="multipleChoice">Include multiple choice:</Label>
              <Checkbox
                id="multipleChoice"
                checked={multipleChoice}
                onCheckedChange={(checked) => setMultipleChoice(checked as boolean)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Start Test
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 