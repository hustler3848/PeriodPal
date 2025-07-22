
'use client';

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  question: z.string().min(10, { message: "Please enter a question with at least 10 characters." }),
});

export default function AskQuestionPage() {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("New question submitted. In a real app, this would be saved to a database.", values);
        toast({
            title: "Question Submitted!",
            description: "Thank you for your feedback. We'll use it to improve our AI.",
        });
        form.reset();
    }

    return (
        <div className="flex flex-col min-h-dvh">
            <AppHeader title="Ask a Question" backButton={true} />
            <main className="flex-1 p-4 sm:p-6 md:p-8">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Submit Your Question</CardTitle>
                        <CardDescription>
                            Can't find an answer in the FAQs or from our AI? Let us know what you're wondering about.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="question"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Question</FormLabel>
                                            <FormControl>
                                                <Textarea 
                                                    placeholder="Type your question here..." 
                                                    className="min-h-[120px]"
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Submit Question</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
