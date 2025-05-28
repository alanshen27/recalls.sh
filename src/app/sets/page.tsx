'use client';

import { useState, useEffect } from 'react';
import { FlashcardSet } from '@prisma/client';
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { TagInput } from "@/components/ui/tag-input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShareSetDialog } from "@/components/share-set-dialog";
import { Loading } from "@/components/ui/loading";

interface SetWithLabels extends Omit<FlashcardSet, 'labels'> {
  labels: string | null;
  flashcards: { id: string }[];
  owner?: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export default function SetsPage() {
  const [sets, setSets] = useState<SetWithLabels[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLabels, setFilterLabels] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState({
    mine: false,
    shared: false
  });
  const [activeTab, setActiveTab] = useState<'mine' | 'shared'>('mine');

  useEffect(() => {
    const fetchSets = async () => {
      // Set loading state for the current tab
      setLoadingStates(prev => ({ ...prev, [activeTab]: true }));
      
      try {
        const response = await fetch(`/api/sets?type=${activeTab}`);
        if (!response.ok) throw new Error('Failed to fetch sets');
        const data = await response.json();
        setSets(data);
      } catch (error) {
        console.error('Error fetching sets:', error);
      } finally {
        // Clear loading state for the current tab
        setLoadingStates(prev => ({ ...prev, [activeTab]: false }));
      }
    };

    fetchSets();
  }, [activeTab]);

  const filteredSets = sets.filter(set => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      set.title.toLowerCase().includes(searchLower) ||
      set.description?.toLowerCase().includes(searchLower) ||
      set.labels?.toLowerCase().includes(searchLower);

    const matchesLabels = filterLabels.length === 0 || 
      filterLabels.some(label => set.labels?.toLowerCase().includes(label.toLowerCase()));

    return matchesSearch && matchesLabels;
  });

  const isLoading = loadingStates[activeTab];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Flashcard Sets</h1>

      <Tabs defaultValue="mine" className="mb-8" onValueChange={(value) => setActiveTab(value as 'mine' | 'shared')}>
        <TabsList>
          <TabsTrigger value="mine">My Sets</TabsTrigger>
          <TabsTrigger value="shared">Shared Sets</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex gap-4 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 px-3 border rounded-md bg-background">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search sets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
            />
          </div>
        </div>
        <div className="flex-2">
          <TagInput
            tags={filterLabels}
            onChange={setFilterLabels}
            placeholder="Filter by labels..."
          />
        </div>
      </div>

      <div className="relative">
        {isLoading && <Loading variant="overlay" />}

        {filteredSets.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No flashcard sets found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-sm font-medium">Title</TableHead>
                  <TableHead className="text-sm font-medium">Description</TableHead>
                  <TableHead className="text-sm font-medium">Labels</TableHead>
                  <TableHead className="text-sm font-medium">Cards</TableHead>
                  {activeTab === 'shared' && (
                    <TableHead className="text-sm font-medium">Shared by</TableHead>
                  )}
                  <TableHead className="text-sm font-medium w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSets.map((set) => (
                  <TableRow 
                    key={set.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell 
                      className="py-4 text-sm"
                      onClick={() => window.location.href = `/sets/${set.id}`}
                    >
                      {set.title}
                    </TableCell>
                    <TableCell 
                      className="py-4 text-sm text-muted-foreground"
                      onClick={() => window.location.href = `/sets/${set.id}`}
                    >
                      {set.description || 'No description'}
                    </TableCell>
                    <TableCell 
                      className="py-4"
                      onClick={() => window.location.href = `/sets/${set.id}`}
                    >
                      <div className="flex flex-wrap gap-1">
                        {set.labels?.split(',').map((label, index) => (
                          <span
                            key={index}
                            className="px-1.5 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground"
                          >
                            {label.trim()}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell 
                      className="text-sm text-muted-foreground"
                      onClick={() => window.location.href = `/sets/${set.id}`}
                    >
                      {set.flashcards.length}
                    </TableCell>
                    {activeTab === 'shared' && (
                      <TableCell 
                        className="text-sm text-muted-foreground"
                        onClick={() => window.location.href = `/sets/${set.id}`}
                      >
                        {set.owner?.name || set.owner?.email || 'Unknown'}
                      </TableCell>
                    )}
                    <TableCell>
                      {activeTab === 'mine' && (
                        <ShareSetDialog setId={set.id} title={set.title} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
} 