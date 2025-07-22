'use client';

import { ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter }from 'next/navigation';

export function AppHeader({ title, backButton = false }: { title: string, backButton?: boolean }) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center w-12">
        {backButton && (
          <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Back">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        )}
      </div>
      <div className="flex-1 text-center">
        <h1 className="text-lg font-semibold font-headline">{title}</h1>
      </div>
      <div className="w-12"></div>
    </header>
  );
}
