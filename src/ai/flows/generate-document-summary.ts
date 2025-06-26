'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a concise summary of a document.
 *
 * - generateDocumentSummary - A function that takes document content as input and returns a summary.
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
    .describe('A concise summary of the document, no more than 150 words.'),
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
  prompt: `You are an expert summarizer. Please provide a concise summary of the following document content, no more than 150 words.\n\nDocument Content:\n{{{documentContent}}}`,
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
