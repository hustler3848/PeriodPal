import type {Metadata, Viewport} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import { Poppins, Inter } from 'next/font/google';
import { BottomNav } from '@/components/bottom-nav';

export const metadata: Metadata = {
  title: 'PeriodPal',
  description: 'Your friendly guide to menstrual health.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#F9E4E8',
}

const fontPoppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-body antialiased", fontPoppins.variable, fontInter.variable, "min-h-screen bg-background font-sans")}>
        <div className="relative flex min-h-dvh flex-col bg-background pb-20 md:pb-0">
          <main className="flex-1">{children}</main>
          <BottomNav />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
