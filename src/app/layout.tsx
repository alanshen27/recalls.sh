import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Recall - Flashcard Learning",
  description: "Create and study flashcards efficiently",
  icons: "/logo-ico.png"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen">
            <Navbar />
            <main>
              {children}
            </main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
} 