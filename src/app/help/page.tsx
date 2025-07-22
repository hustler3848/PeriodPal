
'use client';

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings } from "@/context/settings-provider";
import { localizations } from "@/lib/localization";
import { MessageSquarePlus, ShieldQuestion } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
    const { region, isInitialized } = useSettings();

    if (!isInitialized) {
        return null; // or a loading spinner
    }

    const faqs = localizations[region].faqs;
    const myths = localizations[region].myths;

    return (
        <div className="flex flex-col min-h-dvh">
            <AppHeader title="Help & FAQs" />
            <main className="flex-1 p-4 sm:p-6 md:p-8">
                <Card className="max-w-3xl mx-auto">
                    <CardHeader className="p-4 md:p-6">
                        <CardTitle className="font-headline text-xl md:text-2xl flex items-center gap-2">
                           <ShieldQuestion className="w-6 h-6 md:w-7 md:h-7" /> Frequently Asked Questions
                        </CardTitle>
                        <CardDescription className="text-sm md:text-base">
                            Here are some common questions. For anything else, please use our AI Assistant when you are online.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-left text-sm md:text-base">{faq}</AccordionTrigger>
                                    <AccordionContent className="text-sm md:text-base">
                                       You can ask our AI assistant about this when you are online for a detailed answer.
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>

                <Card className="max-w-3xl mx-auto mt-6 md:mt-8">
                     <CardHeader className="p-4 md:p-6">
                        <CardTitle className="font-headline text-xl md:text-2xl flex items-center gap-2">
                            <MessageSquarePlus className="w-6 h-6 md:w-7 md:h-7" /> Have a Different Question?
                        </CardTitle>
                        <CardDescription className="text-sm md:text-base">
                           If you can't find your answer, ask us directly! We'll use your questions to improve our AI assistant.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                        <Button asChild>
                            <Link href="/help/ask">Ask a Question</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="max-w-3xl mx-auto mt-6 md:mt-8">
                    <CardHeader className="p-4 md:p-6">
                        <CardTitle className="font-headline text-xl md:text-2xl">Myth Busters</CardTitle>
                        <CardDescription className="text-sm md:text-base">
                           Debunking common myths about menstrual health.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                        <Accordion type="single" collapsible className="w-full">
                            {myths.map((myth, index) => (
                                <AccordionItem key={index} value={`myth-${index}`}>
                                    <AccordionTrigger className="text-left font-semibold text-sm md:text-base">{myth.myth}</AccordionTrigger>
                                    <AccordionContent className="text-sm md:text-base">
                                       {myth.reality}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
