import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Location } from "@/lib/data";
import { CheckCircle2, Clock, Flag, Globe, MapPin, Phone, ShieldCheck, Tag } from "lucide-react";
import { Separator } from "./ui/separator";

export function LocationCard({ location }: { location: Location }) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <CardTitle className="font-headline text-base">{location.name}</CardTitle>
        <Badge variant={location.verified_by === 'NGO' ? 'default' : 'secondary'} className="capitalize shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
          {location.verified_by}
        </Badge>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{location.address}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4 shrink-0" />
          <span>{location.open_hours}</span>
        </div>
        {location.contact && (
          <div className="flex items-center gap-2 text-muted-foreground">
            {location.contact.startsWith('http') ? (
                 <Globe className="w-4 h-4 shrink-0" />
            ) : (
                <Phone className="w-4 h-4 shrink-0" />
            )}
            <span>{location.contact}</span>
          </div>
        )}
        <Separator />
        <div className="flex items-start gap-2">
          <Tag className="w-4 h-4 shrink-0 text-accent-foreground mt-0.5" />
          <div className="flex flex-wrap gap-1.5">
            {location.available_products.map(product => (
              <Badge key={product} variant="outline">{product}</Badge>
            ))}
          </div>
        </div>
        {location.wheelchair_accessible && (
          <div className="flex items-center gap-2 text-green-700 dark:text-green-500">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
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
