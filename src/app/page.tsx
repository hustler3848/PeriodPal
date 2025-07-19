import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MessageCircle, MapPin, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="p-4 flex justify-center items-center">
        <div className="flex items-center gap-2 text-2xl font-bold text-primary-foreground font-headline bg-primary py-2 px-4 rounded-full">
          <Heart className="w-8 h-8" />
          <h1>PeriodPal</h1>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        <div className="max-w-md w-full">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-2 text-foreground">
            Welcome!
          </h2>
          <p className="text-muted-foreground mb-8">
            Your friendly guide to menstrual health.
          </p>

          <div className="grid grid-cols-1 gap-4">
            <Link href="/chat" passHref>
              <Button size="lg" className="w-full h-16 text-lg font-semibold shadow-md transition-transform hover:scale-105">
                <MessageCircle className="mr-3 h-6 w-6" />
                Ask a Question
              </Button>
            </Link>
            <Link href="/map" passHref>
              <Button size="lg" variant="secondary" className="w-full h-16 text-lg font-semibold shadow-md transition-transform hover:scale-105">
                <MapPin className="mr-3 h-6 w-6" />
                Find Free Products
              </Button>
            </Link>
          </div>

          <Card className="mt-10 text-left shadow-lg">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <Lightbulb className="w-6 h-6 text-accent-foreground" />
              <CardTitle className="font-headline">Daily Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90">
                Staying hydrated can help ease menstrual cramps. Try drinking an extra glass or two of water today!
              </p>
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
