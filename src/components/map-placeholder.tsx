// This component is no longer used, but we'll keep it for now.
// It has been replaced by the InteractiveMap component.
import Image from "next/image";

export function MapPlaceholder() {
    return (
        <div className="w-full h-full bg-muted overflow-hidden">
            <Image
                src="https://placehold.co/1200x800.png"
                alt="Map of locations"
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                data-ai-hint="city map"
            />
        </div>
    );
}
