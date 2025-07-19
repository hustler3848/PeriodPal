
'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { Location } from '@/lib/data';
import L from 'leaflet';
import React, { useEffect } from 'react';

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

// A custom component to automatically adjust the map view
function MapUpdater({ locations }: { locations: Location[] }) {
    const map = useMap();
    useEffect(() => {
        if (locations && locations.length > 0) {
            const bounds = new L.LatLngBounds(locations.map(loc => [loc.latitude, loc.longitude]));
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [locations, map]);
    return null;
}

interface InteractiveMapProps {
    locations: Location[];
}

const InteractiveMap = React.memo(function InteractiveMap({ locations }: InteractiveMapProps) {
    const defaultPosition: [number, number] = [27.7172, 85.3240]; // Default to Kathmandu

    return (
        <MapContainer 
            center={defaultPosition} 
            zoom={12} 
            className="w-full h-full"
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map(location => (
                <Marker key={location.id} position={[location.latitude, location.longitude]}>
                    <Popup>
                        <div className="font-sans">
                            <h3 className="font-bold">{location.name}</h3>
                            <p>{location.address}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
            <MapUpdater locations={locations} />
        </MapContainer>
    );
});

export default InteractiveMap;
