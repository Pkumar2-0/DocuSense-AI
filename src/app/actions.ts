'use server';

import { generateDocumentSummary } from '@/ai/flows/generate-document-summary';
import { answerQuestionsFromContext } from '@/ai/flows/answer-questions-from-context';
import { evaluateAnswer, type EvaluateAnswerInput } from '@/ai/flows/evaluate-answers-to-challenge-questions';

export async function generateSummaryAction(documentContent: string) {
  try {
    const result = await generateDocumentSummary({ documentContent });
    return result;
  } catch (error) {
    console.error('Error generating summary:', error);
    return { summary: 'Could not generate a summary for this document.' };
  }
}

export async function askQuestionAction(documentContent: string, question: string, conversationHistory: {role: 'user' | 'ai', content: string}[]) {
  
  const history = conversationHistory.map(entry => `${entry.role === 'user' ? 'Previous Question' : 'Previous Answer'}: ${entry.content}`).join('\n\n');
  const fullPrompt = `${history}\n\nQuestion: ${question}`;

  try {
    const result = await answerQuestionsFromContext({ documentContent, question: fullPrompt });
    return result;
  } catch (error) {
    console.error('Error asking question:', error);
    return { answer: 'I encountered an error trying to answer the question.' };
  }
}

export async function generateChallengeQuestionsAction(documentContent: string) {
  try {
    const result = await answerQuestionsFromContext({
      documentContent,
      question: `Generate exactly three challenging, logic-based, or comprehension-focused questions based on the provided document content.
      The questions should be answerable using only the document. Do not provide answers.
      Number each question and separate them with a newline. For example:
      1. What is the main argument?
      2. Who is the intended audience?
      3. What are the key takeaways?`,
    });
    return result.answer.split('\n').filter(q => q.trim().length > 0 && q.match(/^\d\./));
  } catch (error) {
    console.error('Error generating challenge questions:', error);
    return [];
  }
}

export async function evaluateAnswerAction(input: EvaluateAnswerInput) {
  try {
    const result = await evaluateAnswer(input);
    return result;
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return {
      isCorrect: false,
      feedback: 'Could not evaluate the answer due to an error.',
    };
  }
}
