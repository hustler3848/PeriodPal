
'use client';

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/context/settings-provider";
import { localizations } from "@/lib/localization";

export default function SettingsPage() {
    const { region, setRegion, language, setLanguage } = useSettings();
    const { toast } = useToast();

    const handleRegionChange = (value: string) => {
        setRegion(value);
        toast({
            title: "Region Updated",
            description: `Your experience has been updated for ${localizations[value].name}.`,
        });
    };

    const handleLanguageChange = (value: string) => {
        setLanguage(value);
         toast({
            title: "Language Updated",
            description: `Language changed to ${localizations[region].languages.find(l => l.value === value)?.label}.`,
        });
    };

    return (
        <div className="flex flex-col min-h-dvh">
            <AppHeader title="Settings" />
            <main className="flex-1 p-4 sm:p-6 md:p-8">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader className="p-4 md:p-6">
                        <CardTitle className="font-headline text-xl md:text-2xl">Customize Your Experience</CardTitle>
                        <CardDescription className="text-sm md:text-base">
                            Personalize the app's language and content to match your cultural and regional needs.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 p-4 md:p-6">
                        <div className="space-y-2">
                            <Label htmlFor="region-select">Region</Label>
                            <Select value={region} onValueChange={handleRegionChange}>
                                <SelectTrigger id="region-select" className="w-full">
                                    <SelectValue placeholder="Select your region" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(localizations).map(key => (
                                        <SelectItem key={key} value={key}>
                                            {localizations[key].name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs md:text-sm text-muted-foreground">
                                This will adapt content like myths and tips to be more relevant to you.
                            </p>
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="language-select">Language</Label>
                            <Select value={language} onValueChange={handleLanguageChange}>
                                <SelectTrigger id="language-select" className="w-full">
                                    <SelectValue placeholder="Select your language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {localizations[region].languages.map(lang => (
                                        <SelectItem key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                             <p className="text-xs md:text-sm text-muted-foreground">
                                This will translate the app interface and chatbot.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
