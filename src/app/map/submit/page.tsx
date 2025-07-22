
'use client';

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const products = [
    { id: 'pads', label: 'Sanitary Pads' },
    { id: 'tampons', label: 'Tampons' },
    { id: 'cups', label: 'Menstrual Cups' },
    { id: 'reusable', label: 'Reusable Pads' },
]

const formSchema = z.object({
  name: z.string().min(3, { message: "Location name must be at least 3 characters." }),
  address: z.string().min(10, { message: "Please enter a more detailed address." }),
  contact: z.string().optional(),
  available_products: z.array(z.string()).refine(value => value.some(item => item), {
    message: "You have to select at least one item.",
  }),
});

export default function SubmitLocationPage() {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            address: "",
            contact: "",
            available_products: [],
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Form submitted. In a real app, this would be sent to a backend for verification.", values);
        toast({
            title: "Submission Received!",
            description: "Thank you for helping the community. Your suggestion is pending review.",
        });
        form.reset();
    }

    return (
        <div className="flex flex-col min-h-dvh">
            <AppHeader title="Suggest a Location" backButton={true} />
            <main className="flex-1 p-4 sm:p-6 md:p-8">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Help Expand Our Map</CardTitle>
                        <CardDescription>
                            Know a place offering free menstrual products? Share it with the community!
                            All submissions are reviewed before appearing on the map.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Community Health Post" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123 Main St, Anytown, ST 12345" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Please be as specific as possible.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="contact"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contact Info (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Phone number or website" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Helpful for users to verify details.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="available_products"
                                    render={() => (
                                        <FormItem>
                                            <div className="mb-4">
                                                <FormLabel className="text-base">Available Products</FormLabel>
                                                <FormDescription>
                                                    Select all that apply.
                                                </FormDescription>
                                            </div>
                                            {products.map((item) => (
                                                <FormField
                                                    key={item.id}
                                                    control={form.control}
                                                    name="available_products"
                                                    render={({ field }) => {
                                                        return (
                                                        <FormItem
                                                            key={item.id}
                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(item.label)}
                                                                onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...field.value, item.label])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                        (value) => value !== item.label
                                                                        )
                                                                    )
                                                                }}
                                                            />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                {item.label}
                                                            </FormLabel>
                                                        </FormItem>
                                                        )
                                                    }}
                                                    />
                                            ))}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Submit for Review</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
