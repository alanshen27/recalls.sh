'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Share2, Target } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Master Any Subject with{" "}
              <span className="text-primary">Smart Flashcards</span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
              Create, study, and share interactive flashcards. Boost your learning with
              spaced repetition and smart testing.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/sets">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Learn Effectively
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features designed to help you learn faster and retain more
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border bg-card">
              <Brain className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Learning</h3>
              <p className="text-muted-foreground">
                Study with spaced repetition and track your progress over time
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Target className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Test Your Knowledge</h3>
              <p className="text-muted-foreground">
                Take quizzes and tests to reinforce your learning
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Share2 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Share & Collaborate</h3>
              <p className="text-muted-foreground">
                Share your flashcard sets with friends and study together
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started in minutes with our simple process
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Sets</h3>
              <p className="text-muted-foreground">
                Add your flashcards with terms and definitions
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Study & Practice</h3>
              <p className="text-muted-foreground">
                Use our interactive study modes to learn
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your learning and improve over time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of students who have improved their learning
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border bg-card">
              <p className="text-muted-foreground mb-4">
                "This app has completely changed how I study. The spaced repetition
                system is incredibly effective."
              </p>
              <div className="font-semibold">Sarah M.</div>
              <div className="text-sm text-muted-foreground">Medical Student</div>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <p className="text-muted-foreground mb-4">
                "The ability to share sets with classmates has made group study
                sessions so much more productive."
              </p>
              <div className="font-semibold">James K.</div>
              <div className="text-sm text-muted-foreground">Computer Science</div>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <p className="text-muted-foreground mb-4">
                "I love how easy it is to create and organize my flashcards. The
                testing feature is a game-changer."
              </p>
              <div className="font-semibold">Emma L.</div>
              <div className="text-sm text-muted-foreground">Language Learner</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of students who are already using Recall to improve their
            learning
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="text-primary"
            asChild
          >
            <Link href="/sets">
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Recall</h3>
              <p className="text-sm text-muted-foreground">
                The smart way to learn with flashcards
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Create Sets</li>
                <li>Study Mode</li>
                <li>Test Mode</li>
                <li>Share Sets</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>API</li>
                <li>Status</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Recall. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 