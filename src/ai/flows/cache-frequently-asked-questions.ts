'use server';
/**
 * @fileOverview Caches frequently asked questions to improve chatbot response time and reduce LLM costs.
 *
 * - cacheFrequentlyAskedQuestions - A function that caches frequently asked questions.
 * - CacheFrequentlyAskedQuestionsInput - The input type for the cacheFrequentlyAskedQuestions function.
 * - CacheFrequentlyAskedQuestionsOutput - The return type for the cacheFrequentlyAskedQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CacheFrequentlyAskedQuestionsInputSchema = z.object({
  query: z.string().describe('The user query about menstrual health.'),
});
export type CacheFrequentlyAskedQuestionsInput = z.infer<typeof CacheFrequentlyAskedQuestionsInputSchema>;

const CacheFrequentlyAskedQuestionsOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the user query.'),
});
export type CacheFrequentlyAskedQuestionsOutput = z.infer<typeof CacheFrequentlyAskedQuestionsOutputSchema>;

export async function cacheFrequentlyAskedQuestions(input: CacheFrequentlyAskedQuestionsInput): Promise<CacheFrequentlyAskedQuestionsOutput> {
  return cacheFrequentlyAskedQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cacheFrequentlyAskedQuestionsPrompt',
  input: {schema: CacheFrequentlyAskedQuestionsInputSchema},
  output: {schema: CacheFrequentlyAskedQuestionsOutputSchema},
  prompt: `You are a empathetic AI chatbot specializing in answering questions about menstrual health.

  Answer the following question:
  {{query}}
  `,
});

const cacheFrequentlyAskedQuestionsFlow = ai.defineFlow(
  {
    name: 'cacheFrequentlyAskedQuestionsFlow',
    inputSchema: CacheFrequentlyAskedQuestionsInputSchema,
    outputSchema: CacheFrequentlyAskedQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
