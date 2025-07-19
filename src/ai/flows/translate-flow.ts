'use server';

/**
 * @fileOverview A flow that translates text to a specified language.
 *
 * - translate - A function that handles the translation.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'zod';

const TranslateInputSchema = z.object({
  text: z.string(),
  language: z.string(),
});
type TranslateInput = z.infer<typeof TranslateInputSchema>;

const TranslateOutputSchema = z.string();
type TranslateOutput = z.infer<typeof TranslateOutputSchema>;

const translateFlow = ai.defineFlow(
  {
    name: 'translateFlow',
    inputSchema: TranslateInputSchema,
    outputSchema: TranslateOutputSchema,
  },
  async ({text, language}) => {
    const prompt = `Translate the following text to {{language}}: {{{text}}}`;

    const llmResponse = await ai.generate({
      model: googleAI.model('gemini-1.5-flash'),
      prompt: prompt,
      input: {
        language,
        text,
      },
      output: {
        schema: z.string(),
      },
    });

    return llmResponse.output() ?? '';
  }
);

export async function translate(
  input: TranslateInput
): Promise<TranslateOutput> {
  return await translateFlow(input);
}
