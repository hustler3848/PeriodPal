'use client';

import { ChevronLeft, Heart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';

export function AppHeader({ title }: { title: string }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center">
        {isHomePage ? (
          <div className="flex items-center gap-2 font-bold text-primary-foreground font-headline">
            <Heart className="w-6 h-6 text-primary" />
            <span className="text-foreground">{title}</span>
          </div>
        ) : (
          <Button variant="ghost" size="icon" asChild>
            <Link href="/" aria-label="Back to Home">
              <ChevronLeft className="w-6 h-6" />
            </Link>
          </Button>
        )}
      </div>
      <div className="flex-1 text-center">
        {!isHomePage && <h1 className="text-lg font-semibold font-headline">{title}</h1>}
      </div>
      <div className="w-10"></div>
    </header>
  );
}
