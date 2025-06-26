'use server';
/**
 * @fileOverview Defines a Genkit flow for generating challenge questions from a document.
 *
 * - generateChallengeQuestions - A function that creates comprehension questions.
 * - GenerateChallengeQuestionsInput - The input type for the function.
 * - GenerateChallengeQuestionsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChallengeQuestionsInputSchema = z.object({
  documentContent: z.string().describe('The content of the document to create questions from.'),
});
export type GenerateChallengeQuestionsInput = z.infer<typeof GenerateChallengeQuestionsInputSchema>;

const GenerateChallengeQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).describe('An array of exactly three challenge questions.'),
});
export type GenerateChallengeQuestionsOutput = z.infer<typeof GenerateChallengeQuestionsOutputSchema>;

export async function generateChallengeQuestions(input: GenerateChallengeQuestionsInput): Promise<GenerateChallengeQuestionsOutput> {
  return generateChallengeQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChallengeQuestionsPrompt',
  input: {schema: GenerateChallengeQuestionsInputSchema},
  output: {schema: GenerateChallengeQuestionsOutputSchema},
  prompt: `You are a creative quiz master. Your task is to generate exactly three thought-provoking questions from the document provided.

  The questions should:
  - Be answerable only with the information in the document.
  - Encourage critical thinking, logic, or deep comprehension.
  - Be phrased clearly and concisely.

  Document Content:
  ---
  {{{documentContent}}}
  ---
  `,
});

const generateChallengeQuestionsFlow = ai.defineFlow(
  {
    name: 'generateChallengeQuestionsFlow',
    inputSchema: GenerateChallengeQuestionsInputSchema,
    outputSchema: GenerateChallengeQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
