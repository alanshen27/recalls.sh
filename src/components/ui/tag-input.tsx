import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Input } from './input';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ tags, onChange, placeholder = 'Add tags...' }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-1 p-1.5 border rounded-md bg-background">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-0.5 px-1 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-destructive focus:outline-none"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] border-0 p-0 h-6 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Press Enter to add a tag. Click the X to remove a tag.
      </p>
    </div>
  );
} 