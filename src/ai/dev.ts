'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/evaluate-answers-to-challenge-questions.ts';
import '@/ai/flows/answer-questions-from-context.ts';
import '@/ai/flows/generate-document-summary.ts';
import '@/ai/flows/generate-challenge-questions.ts';
