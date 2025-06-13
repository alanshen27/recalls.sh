'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Type, Minus } from "lucide-react";
import { v4 } from 'uuid';

interface Block {
  id: string;
  content: string;
  type: 'text' | 'blank';
  expectedAnswer?: string;
  order: number;
}

interface Question {
  id: string;
  blocks: Block[];
  order: number;
}

interface Worksheet {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

interface WorksheetEditorProps {
  worksheet: Worksheet;
}

export default function WorksheetEditor({ worksheet }: WorksheetEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(worksheet.title);
  const [description, setDescription] = useState(worksheet.description || '');
  const [questions, setQuestions] = useState<Question[]>(worksheet.questions || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [newBlock, setNewBlock] = useState<{ content: string; expectedAnswer?: string }>({ content: '', expectedAnswer: undefined });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/worksheets/${worksheet.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, questions })
      });

      if (!response.ok) throw new Error('Failed to update worksheet');
      router.refresh();
    } catch (error) {
      console.error('Error updating worksheet:', error);
      alert('Failed to update worksheet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this worksheet?')) return;
    try {
      const response = await fetch(`/api/worksheets/${worksheet.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete worksheet');
      router.push('/worksheets');
    } catch (error) {
      console.error('Error deleting worksheet:', error);
      alert('Failed to delete worksheet. Please try again.');
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      id: v4(),
      blocks: [],
      order: questions.length
    }]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const removeBlock = (questionId: string, blockId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          blocks: q.blocks.filter(b => b.id !== blockId)
        };
      }
      return q;
    }));
  };

  const startAddingBlock = (questionId: string, type: 'text' | 'blank') => {
    setActiveQuestionId(questionId);
    setNewBlock({ content: '', expectedAnswer: type === 'blank' ? '' : undefined });
  };

  const handleEditBlockContent = (questionId: string, blockId: string, content: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, blocks: q.blocks.map(b => b.id === blockId ? { ...b, content } : b) };
      }
      return q;
    }));
  };

  const addBlock = () => {
    // if (!activeQuestionId || !newBlock.content) return;
    // if (newBlock.expectedAnswer === '') return;


    setQuestions(questions.map(q => {
      if (q.id === activeQuestionId) {
        return {
          ...q,
          blocks: [...q.blocks, {
            id: v4(),
            content: newBlock.content,
            type: newBlock.expectedAnswer ? 'blank' : 'text',
            expectedAnswer: newBlock.expectedAnswer,
            order: q.blocks.length
          }]
        };
      }
      return q;
    }));

    setActiveQuestionId(null);
    setNewBlock({ content: '', expectedAnswer: undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Worksheet Title"
            className="text-2xl font-bold"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Worksheet Description"
            className="text-muted-foreground"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
          >
            Delete Worksheet
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div
            key={question.id || `new-${index}`}
            className={`p-4 rounded-lg border ${
              activeQuestionId === question.id ? 'border-primary bg-primary/5' : 'border-border'
            } transition-colors`}
            onClick={() => setActiveQuestionId(question.id)}
          >
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Question {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(question.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  {question.blocks.map((block, blockIndex) => (
                    <div key={block.id || `new-${blockIndex}`} className="flex items-center gap-2">
                      {block.type === 'text' ? (
                        <Input className="text-lg" value={block.content} onChange={(e) => handleEditBlockContent(question.id, block.id, e.target.value)} />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Input className="text-lg" value={block.content} onChange={(e) => handleEditBlockContent(question.id, block.id, e.target.value)} />
                          <span className="text-sm text-muted-foreground">
                            ({block.content})
                          </span>
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBlock(question.id, block.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => startAddingBlock(question.id, 'text')}
                >
                  <Type className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => startAddingBlock(question.id, 'blank')}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addQuestion}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      {/* Add Block Interface */}
      {activeQuestionId && (
        <div className="p-4 bg-background border-t shadow-lg">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                {newBlock.expectedAnswer === undefined ? (
                  <Input
                    value={newBlock.content}
                    onChange={(e) => setNewBlock({ ...newBlock, content: e.target.value })}
                    placeholder="Enter text..."
                    className="flex-1"
                    autoFocus
                  />
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={newBlock.content}
                      onChange={(e) => setNewBlock({ ...newBlock, content: e.target.value })}
                      placeholder="Enter text..."
                      className="flex-1"
                      autoFocus
                    />
                    <Input
                      value={newBlock.expectedAnswer}
                      onChange={(e) => setNewBlock({ ...newBlock, expectedAnswer: e.target.value })}
                      placeholder="Expected answer"
                      className="w-48"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addBlock}
                  disabled={!newBlock.content || newBlock.expectedAnswer === ''}
                >
                  Add Block
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setNewBlock({ content: '', expectedAnswer: undefined });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
