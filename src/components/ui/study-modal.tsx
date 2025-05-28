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

interface StudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (count: number, options: StudyOptions) => void;
  maxCards: number;
}

interface StudyOptions {
  count: number;
  mode: 'term' | 'definition' | 'both';
  shuffle: boolean;
  repeat: boolean;
}

export function StudyModal({ isOpen, onClose, onStart, maxCards }: StudyModalProps) {
  const [count, setCount] = useState(Math.min(10, maxCards));
  const [mode, setMode] = useState<'term' | 'definition' | 'both'>('both');
  const [shuffle, setShuffle] = useState(true);
  const [repeat, setRepeat] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(count, {
      count,
      mode,
      shuffle,
      repeat
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start Study Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="count">Number of terms</Label>
              <Input
                id="count"
                type="number"
                min={1}
                max={maxCards}
                value={count}
                onChange={(e) => setCount(Math.min(Number(e.target.value), maxCards))}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="mode" className="text-sm text-muted-foreground">
                  Study mode
                </Label>
                <Select value={mode} onValueChange={(value: 'term' | 'definition' | 'both') => setMode(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="term">Term → Definition</SelectItem>
                    <SelectItem value="definition">Definition → Term</SelectItem>
                    <SelectItem value="both">Both Terms & Definitions</SelectItem>
                  </SelectContent>  
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="shuffle" className="text-sm text-muted-foreground">
                  Shuffle cards
                </Label>
                <Checkbox 
                  id="shuffle" 
                  checked={shuffle}
                  onCheckedChange={(checked) => setShuffle(checked as boolean)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="repeat" className="text-sm text-muted-foreground">
                  Repeat incorrect
                </Label>
                <Checkbox 
                  id="repeat" 
                  checked={repeat}
                  onCheckedChange={(checked) => setRepeat(checked as boolean)}
                />
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Maximum {maxCards} terms available
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Start Studying</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 