'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import EditFlashcards from './EditFlashcards';
import { Set } from '@/lib/types';
import { Loading } from "@/components/ui/loading";

export default function EditSetPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [set, setSet] = useState<Set | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { id } = use(params);


  const fetchSet = async () => {
    try {
      const response = await fetch(`/api/sets/${id}`);
      if (!response.ok) throw new Error('Failed to fetch set');
      const data = await response.json();
      setSet(data);
    } catch (error) {
      console.error('Error fetching set:', error);
      toast.error('Failed to fetch set data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSet();
  }, [id]);

  const updateSet = (field: 'title' | 'description', value: string) => {
    if (!set) return;
    setSet({ ...set, [field]: value });
  };

  const saveSet = async () => {
    if (!set) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/sets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: set.title,
          description: set.description
        }),
      });

      if (!response.ok) throw new Error('Failed to save set');

      toast.success('Set saved successfully');
      router.push(`/sets/${id}`);
    } catch (error) {
      console.error('Error saving set:', error);
      toast.error('Failed to save set');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!set) {
    return <div>Set not found</div>;
  }

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
            <CardTitle>Edit Set</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={set.title}
                onChange={(e) => updateSet('title', e.target.value)}
                placeholder="Enter set title"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Input
                id="description"
                value={set.description || ''}
                onChange={(e) => updateSet('description', e.target.value)}
                placeholder="Enter set description"
              />
            </div>

            <Button
              onClick={saveSet}
              disabled={isSaving}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Set'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Flashcards</CardTitle>
          </CardHeader>
          <CardContent>
            <EditFlashcards
              setId={id}
              initialFlashcards={set.flashcards}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 