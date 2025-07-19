import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Location } from "@/lib/data";
import { CheckCircle2, Clock, MapPin, Tag, Flag } from "lucide-react";
import { Separator } from "./ui/separator";

export function LocationCard({ location }: { location: Location }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-base">{location.name}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{location.address}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4 shrink-0" />
          <span>{location.hours}</span>
        </div>
        <Separator />
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 shrink-0 text-accent-foreground" />
          <div className="flex flex-wrap gap-1.5">
            {location.products.map(product => (
              <Badge key={product} variant="secondary">{product}</Badge>
            ))}
          </div>
        </div>
        {location.accessible && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
            <span>Wheelchair Accessible</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end">
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Flag className="mr-2 h-4 w-4" />
                    Report an issue
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Report an issue</DialogTitle>
                <DialogDescription>
                    Thanks for helping keep our information accurate. Please let us know what's wrong with this listing. This feature is coming soon!
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
