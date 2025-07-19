'use server';

/**
 * @fileOverview A flow that translates text to a specified language.
 *
 * - translate - A function that handles the translation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateInputSchema = z.object({
  text: z.string(),
  language: z.string(),
});
export type TranslateInput = z.infer<typeof TranslateInputSchema>;

const TranslateOutputSchema = z.string();
export type TranslateOutput = z.infer<typeof TranslateOutputSchema>;

export async function translate(input: TranslateInput): Promise<TranslateOutput> {
  return translateFlow(input);
}

const translatePrompt = ai.definePrompt({
  name: 'translatePrompt',
  input: {schema: TranslateInputSchema},
  output: {schema: TranslateOutputSchema},
  prompt: `Translate the following text to {{language}}: {{{text}}}`,
});

const translateFlow = ai.defineFlow(
  {
    name: 'translateFlow',
    inputSchema: TranslateInputSchema,
    outputSchema: TranslateOutputSchema,
  },
  async (input: TranslateInput) => {
    const {output} = await translatePrompt(input);
    return output!;
  }
);
