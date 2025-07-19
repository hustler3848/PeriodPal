import { AppHeader } from "@/components/app-header";
import { LocationCard } from "@/components/location-card";
import { MapPlaceholder } from "@/components/map-placeholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { locations, Location } from "@/lib/data";
import { ListFilter, Search } from "lucide-react";

export default function MapPage() {
  return (
    <div className="flex flex-col h-dvh">
      <AppHeader title="Free Product Locator" />
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search by address or zip code" className="pl-10" />
        </div>
        <div className="flex gap-2 mt-2">
          <Button variant="outline" size="sm">
            <ListFilter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>
      <div className="flex-1 grid md:grid-cols-2 overflow-hidden">
        <div className="relative h-64 md:h-full">
            <MapPlaceholder />
        </div>
        <div className="flex flex-col">
            <h2 className="p-4 text-lg font-semibold border-b md:border-t-0">Locations Near You</h2>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {locations.map((location: Location) => (
                    <LocationCard key={location.id} location={location} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
