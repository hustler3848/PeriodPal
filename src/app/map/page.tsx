
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
    const [activeTab, setActiveTab] = useState('list');

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
    <div className="flex flex-col min-h-dvh bg-background">
      <AppHeader title="Free Product Locator" />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-4">
            <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen} className="border-b bg-background/95 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
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
                <Button variant="ghost" size="icon">
                    <SlidersHorizontal className="h-5 w-5" />
                    <span className="sr-only">Toggle filters</span>
                </Button>
                </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="space-y-4 pt-4">
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
            </Collapsible>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b shrink-0 mx-4">
            <TabsTrigger value="list"><List className="mr-2 h-4 w-4" />List View</TabsTrigger>
            <TabsTrigger value="map"><Map className="mr-2 h-4 w-4" />Map View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto h-[calc(100dvh-18rem)] space-y-2 p-2">
                  <LocationListContent locations={filteredLocations} />
              </div>
          </TabsContent>

          <TabsContent value="map" className="flex-1">
              {activeTab === 'map' && <InteractiveMap locations={filteredLocations} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const LocationListContent = ({ locations }: { locations: Location[] }) => (
    <>
        <div className="p-2 flex justify-between items-center shrink-0 bg-background">
            <h2 className="text-sm md:text-lg font-semibold">
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
            locations.map((location: Location) => (
                <LocationCard key={location.id} location={location} />
            ))
        ) : (
            <div className="flex items-center justify-center text-center p-8 h-48">
                <p className="text-muted-foreground text-sm">
                    No locations match your filters. <br /> Try adjusting your search.
                </p>
            </div>
        )}
    </>
);
