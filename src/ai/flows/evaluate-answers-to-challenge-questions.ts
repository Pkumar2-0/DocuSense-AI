'use server';
/**
 * @fileOverview Evaluates user answers to challenge questions, providing feedback and references from the document.
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
  feedback: z.string().describe('The feedback on the answer, including specific references from the document for justification.'),
  reference: z.string().optional().describe('The reference (e.g., paragraph number) that justifies the answer. Only include if strictly necessary.'),
});
export type EvaluateAnswerOutput = z.infer<typeof EvaluateAnswerOutputSchema>;

export async function evaluateAnswer(input: EvaluateAnswerInput): Promise<EvaluateAnswerOutput> {
  return evaluateAnswerFlow(input);
}

const evaluateAnswerPrompt = ai.definePrompt({
  name: 'evaluateAnswerPrompt',
  input: {schema: EvaluateAnswerInputSchema},
  output: {schema: EvaluateAnswerOutputSchema},
  prompt: `You are an expert evaluator assessing user answers to questions about a document.

  Document Content: {{{documentContent}}}
  Question: {{{question}}}
  Answer: {{{answer}}}

  Determine if the answer is correct based on the document content.
  Provide feedback on the answer, including specific references from the document for justification.
  If the answer is incorrect or incomplete, explain why and provide the correct information from the document.
  Only include a direct quote from the document if it is necessary to explain the answer.

  Format your answer like:
  {
    "isCorrect": true or false,
    "feedback": "Explanation of why the answer is correct or incorrect, with references.",
    "reference": "Paragraph number or section title if strictly necessary."
  }

  Ensure that isCorrect, feedback and reference are valid.
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
