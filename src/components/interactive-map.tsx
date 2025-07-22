
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Location } from '@/lib/data';

// Fix for default icon issue with webpack
const defaultIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = defaultIcon;

interface InteractiveMapProps {
    locations: Location[];
}

export default function InteractiveMap({ locations }: InteractiveMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);

    useEffect(() => {
        // Initialize map only if it hasn't been initialized yet
        if (mapRef.current && !mapInstanceRef.current) {
            const map = L.map(mapRef.current, {
                center: [27.7172, 85.3240], // Default center
                zoom: 12,
                scrollWheelZoom: false,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            mapInstanceRef.current = map;
        }

        // Cleanup function to run when component unmounts
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        // Use a timeout to ensure the map container is visible and has dimensions
        setTimeout(() => {
            map.invalidateSize();

            // Clear existing markers
            markersRef.current.forEach(marker => marker.removeFrom(map));
            markersRef.current = [];

            // Add new markers
            locations.forEach(location => {
                const marker = L.marker([location.latitude, location.longitude]).addTo(map);
                marker.bindPopup(`
                    <div class="font-sans">
                        <h3 class="font-bold">${location.name}</h3>
                        <p>${location.address}</p>
                    </div>
                `);
                markersRef.current.push(marker);
            });

            // Update map view
            if (locations.length > 0) {
                const bounds = new L.LatLngBounds(locations.map(loc => [loc.latitude, loc.longitude]));
                if (bounds.isValid()) {
                    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
                }
            } else {
                // If no locations, center on default position
                const defaultPosition: [number, number] = [27.7172, 85.3240];
                map.setView(defaultPosition, 12);
            }
        }, 100);

    }, [locations]); // Re-run this effect when locations change

    return <div ref={mapRef} className="w-full h-full" />;
}
