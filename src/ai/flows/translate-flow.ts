/**
 * @fileOverview A flow that translates text to a specified language.
 *
 * - translate - A function that handles the translation.
 * - TranslateInput - The input type for the translate function.
 * - TranslateOutput - The return type for the translate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const TranslateInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  language: z.string().describe('The language to translate to.'),
});
export type TranslateInput = z.infer<typeof TranslateInputSchema>;

export const TranslateOutputSchema = z.object({
  translation: z.string().describe('The translated text.'),
});
export type TranslateOutput = z.infer<typeof TranslateOutputSchema>;

export async function translate(
  input: TranslateInput
): Promise<string> {
  const result = await translateFlow(input);
  return result.translation;
}

const translatePrompt = ai.definePrompt({
    name: 'translatePrompt',
    input: { schema: TranslateInputSchema },
    output: { schema: TranslateOutputSchema },
    prompt: `Translate the following text to {{language}}: {{{text}}}`,
    model: 'googleai/gemini-1.5-flash',
});


const translateFlow = ai.defineFlow(
  {
    name: 'translateFlow',
    inputSchema: TranslateInputSchema,
    outputSchema: TranslateOutputSchema,
  },
  async (input) => {
    const llmResponse = await translatePrompt(input);
    return llmResponse.output()!;
  }
);
