
'use client';

import { AppHeader } from "@/components/app-header";
import { LocationCard } from "@/components/location-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { locations as allLocations, Location } from "@/lib/data";
import { PlusCircle, Search, LoaderCircle, List, Map, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const allProducts = Array.from(new Set(allLocations.flatMap(l => l.available_products)));

const InteractiveMap = dynamic(() => import('@/components/interactive-map'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted flex items-center justify-center"><LoaderCircle className="w-8 h-8 animate-spin" /></div>
});

export default function MapPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [showAccessible, setShowAccessible] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const handleProductChange = (product: string) => {
        setSelectedProducts(prev => 
            prev.includes(product) 
            ? prev.filter(p => p !== product) 
            : [...prev, product]
        );
    };

    const filteredLocations = useMemo(() => {
        return allLocations.filter(location => {
            const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  location.address.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesProducts = selectedProducts.length === 0 || 
                                    selectedProducts.every(p => location.available_products.includes(p));

            const matchesAccessibility = !showAccessible || location.wheelchair_accessible;

            return matchesSearch && matchesProducts && matchesAccessibility;
        });
    }, [searchTerm, selectedProducts, showAccessible]);

  return (
    <div className="flex flex-col h-dvh bg-background">
      <AppHeader title="Free Product Locator" />
      
      {/* Filters Section */}
      <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen} className="border-b">
        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search by address or name" 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
             <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden ml-2">
                  <SlidersHorizontal className="h-5 w-5" />
                  <span className="sr-only">Toggle filters</span>
                </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className={cn("space-y-4", { 'hidden md:block': !isFiltersOpen })}>
            <div>
                <Label className="text-sm font-semibold">Product Type</Label>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                    {allProducts.map(product => (
                        <div key={product} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`product-${product}`} 
                                checked={selectedProducts.includes(product)}
                                onCheckedChange={() => handleProductChange(product)}
                            />
                            <Label htmlFor={`product-${product}`} className="font-normal text-sm">{product}</Label>
                        </div>
                    ))}
                </div>
            </div>
             <div>
                <Label className="text-sm font-semibold">Accessibility</Label>
                 <div className="flex items-center space-x-2 mt-2">
                    <Checkbox 
                        id="accessible"
                        checked={showAccessible}
                        onCheckedChange={(checked) => setShowAccessible(!!checked)}
                    />
                    <Label htmlFor="accessible" className="font-normal text-sm">Wheelchair Accessible</Label>
                </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Desktop: Map View */}
        <div className="relative hidden md:block md:w-1/2 lg:w-2/3 h-full">
            <InteractiveMap locations={filteredLocations} />
        </div>

        {/* Mobile: Tabbed View */}
        <div className="flex-1 flex flex-col md:hidden overflow-hidden">
          <Tabs defaultValue="list" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-2 m-2 mb-0">
              <TabsTrigger value="list"><List className="mr-2 h-4 w-4" />List View</TabsTrigger>
              <TabsTrigger value="map"><Map className="mr-2 h-4 w-4" />Map View</TabsTrigger>
            </TabsList>
            <TabsContent value="list" className="flex-1 flex flex-col overflow-y-auto mt-0">
              <LocationListContent locations={filteredLocations} />
            </TabsContent>
            <TabsContent value="map" className="flex-1 bg-muted mt-2">
               <InteractiveMap locations={filteredLocations} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop: List View */}
        <div className="hidden md:flex md:flex-col md:w-1/2 lg:w-1/3 border-l overflow-hidden">
           <LocationListContent locations={filteredLocations} />
        </div>
      </div>
    </div>
  );
}


// Helper component for the location list content to avoid duplication
const LocationListContent = ({ locations }: { locations: Location[] }) => (
  <>
    <div className="p-4 flex justify-between items-center shrink-0 border-b">
        <h2 className="text-base md:text-lg font-semibold">
            Locations ({locations.length})
        </h2>
        <Button asChild variant="outline" size="sm">
            <Link href="/map/submit">
                <PlusCircle className="mr-2 h-4 w-4" />
                Suggest
            </Link>
        </Button>
    </div>
    {locations.length > 0 ? (
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {locations.map((location: Location) => (
                <LocationCard key={location.id} location={location} />
            ))}
        </div>
    ) : (
        <div className="flex-1 flex items-center justify-center text-center p-8">
            <p className="text-muted-foreground text-sm md:text-base">
                No locations match your filters. <br /> Try adjusting your search.
            </p>
        </div>
    )}
  </>
);
