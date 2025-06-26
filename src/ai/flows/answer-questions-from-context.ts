'use server';
/**
 * @fileOverview This file defines a Genkit flow for answering questions based on the content of a document and conversation history.
 *
 * - answerQuestionsFromContext - A function that handles answering questions based on document context.
 * - AnswerQuestionsFromContextInput - The input type for the answerQuestionsFromContext function.
 * - AnswerQuestionsFromContextOutput - The return type for the answerQuestionsFromContext function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsFromContextInputSchema = z.object({
  documentContent: z.string().describe('The content of the document to answer questions from.'),
  question: z.string().describe('The user\'s current question about the document.'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'ai']),
    content: z.string(),
  })).optional().describe('A history of the conversation so far.'),
});
export type AnswerQuestionsFromContextInput = z.infer<typeof AnswerQuestionsFromContextInputSchema>;

const AnswerQuestionsFromContextOutputSchema = z.object({
  answer: z.string().describe('The answer to the question, based on the document content and conversation history.'),
  reference: z
    .string()
    .optional()
    .describe('A specific quote or reference from the document that supports the answer.'),
});
export type AnswerQuestionsFromContextOutput = z.infer<typeof AnswerQuestionsFromContextOutputSchema>;

export async function answerQuestionsFromContext(input: AnswerQuestionsFromContextInput): Promise<AnswerQuestionsFromContextOutput> {
  return answerQuestionsFromContextFlow(input);
}

const answerQuestionsFromContextPrompt = ai.definePrompt({
  name: 'answerQuestionsFromContextPrompt',
  input: {schema: AnswerQuestionsFromContextInputSchema},
  output: {schema: AnswerQuestionsFromContextOutputSchema},
  prompt: `You are DocuSense AI, a friendly and helpful assistant designed to help users understand documents.

Your goal is to answer the user's questions based on the provided document content. Use a warm and conversational tone.

Here is the document content:
---
{{{documentContent}}}
---

{{#if conversationHistory}}
Here is our conversation history so far. Use it to understand the context of the user's new question.
---
{{#each conversationHistory}}
{{#if (eq this.role "user")}}
User: {{{this.content}}}
{{else}}
You: {{{this.content}}}
{{/if}}
{{/each}}
---
{{/if}}

Based on our conversation and the document, please answer the following question. If the answer is found in the text, provide a specific reference or quote. If you truly cannot find an answer, politely say so.

User's Question: {{{question}}}

Your Answer:`,
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
