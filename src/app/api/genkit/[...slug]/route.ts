import { nextJsApiRouter } from "@genkit-ai/next";
import "@/ai/flows/answer-menstrual-health-question";
import "@/ai/flows/cache-frequently-asked-questions";
import "@/ai/flows/translate-text";

export const { GET, POST } = nextJsApiRouter();
