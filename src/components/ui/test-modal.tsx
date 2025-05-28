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

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (count: number) => void;
  maxCards: number;
}

export function TestModal({ isOpen, onClose, onStart, maxCards }: TestModalProps) {
  const [count, setCount] = useState(Math.min(10, maxCards));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(count);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start Test</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="count">Number of questions</Label>
              <Input
                id="count"
                type="number"
                min={1}
                max={maxCards}
                value={count}
                onChange={(e) => setCount(Math.min(Number(e.target.value), maxCards))}
              />
              <p className="text-sm text-muted-foreground">
                Maximum {maxCards} questions available
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Start Test</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 