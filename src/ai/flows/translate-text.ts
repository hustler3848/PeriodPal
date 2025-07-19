
'use server';

/**
 * @fileOverview A Genkit flow for translating text to a specified language.
 *
 * - translateText - A function that translates text.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TranslateTextInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  targetLanguage: z
    .string()
    .describe(
      'The target language for translation (e.g., "es" for Spanish, "fr" for French, "ne" for Nepali).'
    ),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(
  input: TranslateTextInput
): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateTextPrompt',
  input: { schema: TranslateTextInputSchema },
  output: { schema: TranslateTextOutputSchema },
  model: 'googleai/gemini-1.5-flash',
  prompt: `Translate the following text to {{targetLanguage}}.

Text: {{{text}}}

Only output the translated text, with no additional commentary or explanation.
`,
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async (input) => {
    // If the input text is empty or the target language is English, no need to call the LLM
    if (!input.text.trim() || input.targetLanguage === 'en') {
        return { translatedText: input.text };
    }
    
    const { output } = await prompt(input);
    return output!;
  }
);
