'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface ContentBlock {
  content: string;
  type: 'text' | 'blank';
  expectedAnswer?: string;
  order: number;
}

export default function NewWorksheetForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contents, setContents] = useState<ContentBlock[]>([
    { content: '', type: 'text', order: 0 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addContentBlock = (type: 'text' | 'blank') => {
    setContents([...contents, { 
      content: '', 
      type,
      expectedAnswer: type === 'blank' ? '' : undefined,
      order: contents.length
    }]);
  };

  const updateContent = (index: number, value: string) => {
    const newContents = [...contents];
    newContents[index].content = value;
    setContents(newContents);
  };

  const updateExpectedAnswer = (index: number, value: string) => {
    const newContents = [...contents];
    newContents[index].expectedAnswer = value;
    setContents(newContents);
  };

  const removeContentBlock = (index: number) => {
    setContents(contents.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/worksheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          contents,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create worksheet');
      }

      const worksheet = await response.json();
      router.push(`/worksheets/${worksheet.id}`);
    } catch (error) {
      console.error('Error creating worksheet:', error);
      alert('Failed to create worksheet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Content Blocks</h2>
          <div className="space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => addContentBlock('text')}
            >
              Add Text
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => addContentBlock('blank')}
            >
              Add Blank
            </Button>
          </div>
        </div>

        {contents.map((block, index) => (
          <Card key={index}>
            <CardContent className="p-4 space-y-4">
              <div className="flex gap-2">
                <Textarea
                  value={block.content}
                  onChange={(e) => updateContent(index, e.target.value)}
                  placeholder={block.type === 'text' ? 'Enter text...' : 'Enter blank space...'}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeContentBlock(index)}
                >
                  ×
                </Button>
              </div>
              {block.type === 'blank' && (
                <div>
                  <label className="text-sm font-medium">Expected Answer (Optional)</label>
                  <Input
                    value={block.expectedAnswer || ''}
                    onChange={(e) => updateExpectedAnswer(index, e.target.value)}
                    placeholder="Enter expected answer..."
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Worksheet'}
        </Button>
      </div>
    </form>
  );
} 