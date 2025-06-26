'use server';

import { generateDocumentSummary } from '@/ai/flows/generate-document-summary';
import { answerQuestionsFromContext, type AnswerQuestionsFromContextInput } from '@/ai/flows/answer-questions-from-context';
import { evaluateAnswer, type EvaluateAnswerInput } from '@/ai/flows/evaluate-answers-to-challenge-questions';
import { generateChallengeQuestions } from '@/ai/flows/generate-challenge-questions';

export async function generateSummaryAction(documentContent: string) {
  try {
    const result = await generateDocumentSummary({ documentContent });
    return result;
  } catch (error) {
    console.error('Error generating summary:', error);
    return { summary: 'I had trouble creating a summary for this document. Please try again.' };
  }
}

export async function askQuestionAction(documentContent: string, question: string, conversationHistory: AnswerQuestionsFromContextInput['conversationHistory']) {
  try {
    const result = await answerQuestionsFromContext({ documentContent, question, conversationHistory });
    return result;
  } catch (error) {
    console.error('Error asking question:', error);
    return { answer: 'I encountered an error trying to answer that. Could you try rephrasing?' };
  }
}

export async function generateChallengeQuestionsAction(documentContent: string) {
  try {
    const result = await generateChallengeQuestions({ documentContent });
    return result.questions;
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
      feedback: 'Sorry, I couldn\'t evaluate that answer due to an error.',
    };
  }
}
