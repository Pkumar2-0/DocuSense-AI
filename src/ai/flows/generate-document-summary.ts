'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a clear and helpful summary of a document.
 *
 * - generateDocumentSummary - A function that takes document content and returns a summary.
 * - GenerateDocumentSummaryInput - The input type for the generateDocumentSummary function.
 * - GenerateDocumentSummaryOutput - The return type for the generateDocumentSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDocumentSummaryInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The content of the document to be summarized.'),
});
export type GenerateDocumentSummaryInput = z.infer<
  typeof GenerateDocumentSummaryInputSchema
>;

const GenerateDocumentSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A clear, concise summary of the document (around 150 words).'),
});
export type GenerateDocumentSummaryOutput = z.infer<
  typeof GenerateDocumentSummaryOutputSchema
>;

export async function generateDocumentSummary(
  input: GenerateDocumentSummaryInput
): Promise<GenerateDocumentSummaryOutput> {
  return generateDocumentSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDocumentSummaryPrompt',
  input: {schema: GenerateDocumentSummaryInputSchema},
  output: {schema: GenerateDocumentSummaryOutputSchema},
  prompt: `Your goal is to help the user quickly grasp the main points of their document.

  Please write a clear, concise, and easy-to-read summary of the following document content. The summary should be no more than 150 words. Focus on the key information and takeaways.

  Document Content:
  ---
  {{{documentContent}}}
  ---`,
});

const generateDocumentSummaryFlow = ai.defineFlow(
  {
    name: 'generateDocumentSummaryFlow',
    inputSchema: GenerateDocumentSummaryInputSchema,
    outputSchema: GenerateDocumentSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
