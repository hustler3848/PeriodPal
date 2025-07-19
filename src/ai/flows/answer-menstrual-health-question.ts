'use server';

/**
 * @fileOverview An AI agent that answers questions about menstrual health with empathy
 * and suggests follow-up questions.
 *
 * - answerMenstrualHealthQuestion - A function that handles the question answering process.
 * - AnswerMenstrualHealthQuestionInput - The input type for the answerMenstrualHealthQuestion function.
 * - AnswerMenstrualHealthQuestionOutput - The return type for the answerMenstrualHealthQuestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const AnswerMenstrualHealthQuestionInputSchema = z.object({
  question: z.string().describe('The latest question about menstrual health.'),
  chatHistory: z.array(MessageSchema).optional().describe('The history of the conversation so far.'),
});
export type AnswerMenstrualHealthQuestionInput = z.infer<
  typeof AnswerMenstrualHealthQuestionInputSchema
>;

const AnswerMenstrualHealthQuestionOutputSchema = z.object({
  answer: z
    .string()
    .describe('The answer to the question about menstrual health.'),
  suggestedQuestions: z.array(z.string()).optional().describe('A list of 2-3 suggested follow-up questions based on the conversation.')
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
  input: { schema: AnswerMenstrualHealthQuestionInputSchema },
  output: { schema: AnswerMenstrualHealthQuestionOutputSchema },
  prompt: `You are an AI chatbot named PeriodPal. You are designed to answer questions about menstrual health with empathy, accuracy, and care. Your tone should be friendly, reassuring, and supportive.

  You should be able to answer questions related to the following topics:
  - Managing period cramps (e.g., "How to manage cramps?")
  - First period advice (e.g., "I got my first period, what should I do?")
  - Finding emergency products (e.g., "I don’t have pads")
  - Reusable vs. disposable products (e.g., "What is better, reusable or disposable pads?")
  - Hygiene tips (e.g., "How to stay clean during periods?")

  If a question is outside of this scope, or if you don't understand it, respond with: "I’m here to help! Sorry, I didn’t understand that. Try rephrasing or check our offline FAQ."

  Always prioritize safety and advise users to consult a doctor for medical concerns.

  Based on the conversation history below, answer the user's latest question. After providing the answer, generate 2-3 relevant follow-up questions a user might have.

  {{#if chatHistory}}
  Conversation History:
  {{#each chatHistory}}
  {{this.role}}: {{this.content}}
  {{/each}}
  {{/if}}

  Latest Question: {{{question}}}

  Respond with your answer and the suggested questions.
  `,
});

const answerMenstrualHealthQuestionFlow = ai.defineFlow(
  {
    name: 'answerMenstrualHealthQuestionFlow',
    inputSchema: AnswerMenstrualHealthQuestionInputSchema,
    outputSchema: AnswerMenstrualHealthQuestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
