'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { NotificationsDropdown } from "@/components/notifications-dropdown";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold flex flex-row gap-2 items-center">
            <img src="/logo.png" className="h-6"/>
          </Link>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link href="/sets">
                  <Button variant="ghost">My Sets</Button>
                </Link>
                <Button variant="default" onClick={() => router.push('/sets/new')}>Create Set</Button>
                <NotificationsDropdown />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          className="h-6 w-6 rounded-full"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push('/settings')}>
                      <Link href="/settings">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 