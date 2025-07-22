

'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings } from "@/context/settings-provider";
import { localizations } from "@/lib/localization";
import { Lightbulb, MapPin, MessageCircle, ShieldQuestion } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function HomePage() {
  const { region, language, isInitialized } = useSettings();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !isInitialized) {
    return null; // or a loading spinner
  }

  const localization = localizations[region];
  const myth = localization.myths[Math.floor(Math.random() * localization.myths.length)];
  const uiText = localization.ui[language] || localization.ui.en; // Fallback to English

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="py-6 md:py-8 flex justify-center items-center">
        <Image 
          src="/logo.png"
          alt="PeriodPal Logo"
          width={220}
          height={90}
          priority
        />
      </header>
      <main className="flex-1 flex flex-col px-4 items-center justify-center text-center">
        <div className="max-w-md w-full">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-2 text-foreground">
            {uiText.welcome}
          </h2>
          <p className="text-muted-foreground mb-6 text-base md:text-lg">
            {uiText.welcomeSubtitle}
          </p>

          <div className="grid grid-cols-1 gap-4">
            <Link href="/chat" passHref>
              <Button size="lg" className="w-full h-14 text-base md:text-lg tracking-wide font-semibold">
                <MessageCircle className="mr-3 h-5 w-5" />
                {uiText.askAQuestion}
              </Button>
            </Link>
            <Link href="/map" passHref>
              <Button size="lg" variant="secondary" className="w-full h-14 text-base md:text-lg tracking-wide font-semibold">
                <MapPin className="mr-3 h-5 w-5" />
                {uiText.findFreeProducts}
              </Button>
            </Link>
          </div>

          <Card className="mt-8 md:mt-10 text-left shadow-lg border-accent rounded-xl">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
              <div className="p-2.5 bg-accent/50 rounded-full">
                <Lightbulb className="w-5 h-5 text-accent-foreground" />
              </div>
              <CardTitle className="font-headline text-lg md:text-xl">{uiText.dailyTip}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-foreground/90 text-sm md:text-base">
                {uiText.tipContent}
              </p>
            </CardContent>
          </Card>

          <Card className="mt-6 text-left shadow-lg border-secondary rounded-xl">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
               <div className="p-2.5 bg-secondary/50 rounded-full">
                <ShieldQuestion className="w-5 h-5 text-secondary-foreground" />
              </div>
              <CardTitle className="font-headline text-lg md:text-xl">{uiText.mythBuster}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
              <p className="font-semibold text-foreground/90 text-sm md:text-base">{myth.myth}</p>
              <p className="text-foreground/80 text-sm md:text-base">{myth.reality}</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="p-4 text-center">
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy Notice
          </Link>
      </footer>
    </div>
  );
}
