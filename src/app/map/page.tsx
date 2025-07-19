
'use client';

import { AppHeader } from "@/components/app-header";
import { LocationCard } from "@/components/location-card";
import { MapPlaceholder } from "@/components/map-placeholder";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { locations as allLocations, Location } from "@/lib/data";
import { ListFilter, PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const allProducts = Array.from(new Set(allLocations.flatMap(l => l.available_products)));

export default function MapPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [showAccessible, setShowAccessible] = useState(false);

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
    <div className="flex flex-col h-dvh">
      <AppHeader title="Free Product Locator" />
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search by address or name" 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-y-4 mt-4">
            <div>
                <Label className="text-base font-semibold">Product Type</Label>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                    {allProducts.map(product => (
                        <div key={product} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`product-${product}`} 
                                checked={selectedProducts.includes(product)}
                                onCheckedChange={() => handleProductChange(product)}
                            />
                            <Label htmlFor={`product-${product}`} className="font-normal">{product}</Label>
                        </div>
                    ))}
                </div>
            </div>
             <div>
                <Label className="text-base font-semibold">Accessibility</Label>
                 <div className="flex items-center space-x-2 mt-2">
                    <Checkbox 
                        id="accessible"
                        checked={showAccessible}
                        onCheckedChange={(checked) => setShowAccessible(!!checked)}
                    />
                    <Label htmlFor="accessible" className="font-normal">Wheelchair Accessible</Label>
                </div>
            </div>
        </div>
      </div>
      <div className="flex-1 grid md:grid-cols-2 overflow-hidden">
        <div className="relative h-64 md:h-full">
            <MapPlaceholder />
        </div>
        <div className="flex flex-col">
            <div className="p-4 flex justify-between items-center border-b md:border-t-0">
                <h2 className="text-lg font-semibold">
                    Locations ({filteredLocations.length})
                </h2>
                <Button asChild variant="outline" size="sm">
                    <Link href="/map/submit">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Suggest a Location
                    </Link>
                </Button>
            </div>
            {filteredLocations.length > 0 ? (
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {filteredLocations.map((location: Location) => (
                        <LocationCard key={location.id} location={location} />
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-center p-8">
                    <p className="text-muted-foreground">
                        No locations match your filters. <br /> Try adjusting your search.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
