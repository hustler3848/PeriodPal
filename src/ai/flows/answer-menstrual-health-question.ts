// 'use server';

/**
 * @fileOverview An AI agent that answers questions about menstrual health with empathy.
 *
 * - answerMenstrualHealthQuestion - A function that handles the question answering process.
 * - AnswerMenstrualHealthQuestionInput - The input type for the answerMenstrualHealthQuestion function.
 * - AnswerMenstrualHealthQuestionOutput - The return type for the answerMenstrualHealthQuestion function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerMenstrualHealthQuestionInputSchema = z.object({
  question: z.string().describe('The question about menstrual health.'),
});
export type AnswerMenstrualHealthQuestionInput = z.infer<
  typeof AnswerMenstrualHealthQuestionInputSchema
>;

const AnswerMenstrualHealthQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about menstrual health.'),
});
export type AnswerMenstrualHealthQuestionOutput = z.infer<
  typeof AnswerMenstrualHealthQuestionOutputSchema
>;

export async function answerMenstrualHealthQuestion(
  input: AnswerMenstrualHealthQuestionInput
): Promise<AnswerMenstrualHealthQuestionOutput> {
  return answerMenstrualHealthQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerMenstrualHealthQuestionPrompt',
  input: {schema: AnswerMenstrualHealthQuestionInputSchema},
  output: {schema: AnswerMenstrualHealthQuestionOutputSchema},
  prompt: `You are an AI chatbot designed to answer questions about menstrual health with empathy and accuracy.

  Question: {{{question}}}
  Answer: `,
});

const answerMenstrualHealthQuestionFlow = ai.defineFlow(
  {
    name: 'answerMenstrualHealthQuestionFlow',
    inputSchema: AnswerMenstrualHealthQuestionInputSchema,
    outputSchema: AnswerMenstrualHealthQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
