'use server';
/**
 * @fileOverview Evaluates user answers to challenge questions, providing friendly, encouraging feedback.
 *
 * - evaluateAnswer - A function that evaluates the answer.
 * - EvaluateAnswerInput - The input type for the evaluateAnswer function.
 * - EvaluateAnswerOutput - The return type for the evaluateAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateAnswerInputSchema = z.object({
  documentContent: z.string().describe('The content of the document.'),
  question: z.string().describe('The challenge question derived from the document.'),
  answer: z.string().describe('The user provided answer to the challenge question.'),
});
export type EvaluateAnswerInput = z.infer<typeof EvaluateAnswerInputSchema>;

const EvaluateAnswerOutputSchema = z.object({
  isCorrect: z.boolean().describe('Whether the answer is correct or not.'),
  feedback: z.string().describe('Friendly and constructive feedback on the answer, including references for justification.'),
  reference: z.string().optional().describe('A specific quote from the document that justifies the answer.'),
});
export type EvaluateAnswerOutput = z.infer<typeof EvaluateAnswerOutputSchema>;

export async function evaluateAnswer(input: EvaluateAnswerInput): Promise<EvaluateAnswerOutput> {
  return evaluateAnswerFlow(input);
}

const evaluateAnswerPrompt = ai.definePrompt({
  name: 'evaluateAnswerPrompt',
  input: {schema: EvaluateAnswerInputSchema},
  output: {schema: EvaluateAnswerOutputSchema},
  prompt: `You are a friendly and encouraging tutor. Your goal is to evaluate a user's answer to a question about a document and provide constructive, helpful feedback.

  Document Content:
  ---
  {{{documentContent}}}
  ---

  Question: {{{question}}}
  User's Answer: {{{answer}}}

  Analyze the user's answer based *only* on the document content.
  - If the answer is correct, affirm it and briefly explain why, perhaps referencing the document.
  - If the answer is incorrect or partially correct, gently explain the misunderstanding and guide the user to the correct answer using information and direct quotes from the document.
  - Always maintain a positive and supportive tone.
`,
});

const evaluateAnswerFlow = ai.defineFlow(
  {
    name: 'evaluateAnswerFlow',
    inputSchema: EvaluateAnswerInputSchema,
    outputSchema: EvaluateAnswerOutputSchema,
  },
  async input => {
    const {output} = await evaluateAnswerPrompt(input);
    return output!;
  }
);
