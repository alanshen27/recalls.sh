'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WorksheetEditor from './WorksheetEditor';

interface Worksheet {
  id: string;
  title: string;
  description?: string;
  questions: {  
    id: string;
    blocks: {
      id: string;
      content: string;
      type: string;
      expectedAnswer?: string;
      order: number;
    }[];
  }[];
}

export default function WorksheetPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [worksheet, setWorksheet] = useState<Worksheet | null>(null);
  const [loading, setLoading] = useState(true);

const { id } = use(params);

  useEffect(() => {
    const fetchWorksheet = async () => {
      try {
        const res = await fetch(`/api/worksheets/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            router.push('/worksheets');
            return;
          }
          throw new Error('Failed to fetch worksheet');
        }
        const data = await res.json();
        setWorksheet(data);
      } catch (error) {
        console.error('Error fetching worksheet:', error);
        router.push('/worksheets');
      } finally {
        setLoading(false);
      }
    };

    fetchWorksheet();
  }, [id, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!worksheet) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{worksheet.title}</h1>
      <WorksheetEditor worksheet={worksheet} />
    </div>
  );
} 