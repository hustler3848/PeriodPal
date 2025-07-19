
'use client';

import { cn } from "@/lib/utils";
import { Heart, Home, MapPin, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/chat', label: 'Ask', icon: MessageCircle },
    { href: '/map', label: 'Map', icon: MapPin },
    { href: '/privacy', label: 'Privacy', icon: Heart },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-background/95 backdrop-blur-sm border-t z-50">
            <div className="flex justify-around items-center h-full max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center gap-1 w-20 h-full">
                            <item.icon className={cn(
                                "w-7 h-7 transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )} />
                            <span className={cn(
                                "text-xs font-medium transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    );
}
