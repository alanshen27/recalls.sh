'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Master Your Knowledge with Flashcards
        </h1>
        <p className="text-xl text-muted-foreground">
          Create, study, and master your flashcards with our intuitive platform.
          Perfect for students, professionals, and lifelong learners.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/sets">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-24 grid gap-8 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Create Sets</CardTitle>
            <CardDescription>
              Organize your flashcards into custom sets for different subjects or topics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Create as many sets as you need and keep your learning materials organized.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Study Smart</CardTitle>
            <CardDescription>
              Use our interactive study mode to master your flashcards efficiently.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Flip cards, track progress, and focus on what you need to learn most.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Track Progress</CardTitle>
            <CardDescription>
              Monitor your learning journey and identify areas for improvement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              See your progress over time and focus on cards that need more attention.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 