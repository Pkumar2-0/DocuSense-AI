'use server';
/**
 * @fileOverview This file defines a Genkit flow for answering questions based on the content of a document.
 *
 * - answerQuestionsFromContext - A function that handles answering questions based on document context.
 * - AnswerQuestionsFromContextInput - The input type for the answerQuestionsFromContext function.
 * - AnswerQuestionsFromContextOutput - The return type for the answerQuestionsFromContext function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsFromContextInputSchema = z.object({
  documentContent: z.string().describe('The content of the document to answer questions from.'),
  question: z.string().describe('The question to answer about the document.'),
});
export type AnswerQuestionsFromContextInput = z.infer<typeof AnswerQuestionsFromContextInputSchema>;

const AnswerQuestionsFromContextOutputSchema = z.object({
  answer: z.string().describe('The answer to the question, based on the document content.'),
  reference: z
    .string()
    .optional()
    .describe('The reference (e.g., paragraph number) in the document where the answer was found.'),
});
export type AnswerQuestionsFromContextOutput = z.infer<typeof AnswerQuestionsFromContextOutputSchema>;

export async function answerQuestionsFromContext(input: AnswerQuestionsFromContextInput): Promise<AnswerQuestionsFromContextOutput> {
  return answerQuestionsFromContextFlow(input);
}

const answerQuestionsFromContextPrompt = ai.definePrompt({
  name: 'answerQuestionsFromContextPrompt',
  input: {schema: AnswerQuestionsFromContextInputSchema},
  output: {schema: AnswerQuestionsFromContextOutputSchema},
  prompt: `You are an AI assistant that answers questions based on the content of a document.
  You will be given the content of a document and a question. Your task is to answer the question based on the document content.
  If the answer is explicitly available in the document, provide the answer and a reference to the location of the answer (e.g., paragraph number).
  If you cannot find the answer in the document, respond that the answer is not available in the document.

  Document Content: {{{documentContent}}}
  Question: {{{question}}}

  Answer:`,
});

const answerQuestionsFromContextFlow = ai.defineFlow(
  {
    name: 'answerQuestionsFromContextFlow',
    inputSchema: AnswerQuestionsFromContextInputSchema,
    outputSchema: AnswerQuestionsFromContextOutputSchema,
  },
  async input => {
    const {output} = await answerQuestionsFromContextPrompt(input);
    return output!;
  }
);
