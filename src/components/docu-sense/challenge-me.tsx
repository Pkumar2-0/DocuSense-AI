'use client';

import { useEffect, useState, FormEvent } from 'react';
import type { Document } from '@/app/page';
import { generateChallengeQuestionsAction, evaluateAnswerAction } from '@/app/actions';
import type { EvaluateAnswerOutput } from '@/ai/flows/evaluate-answers-to-challenge-questions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, XCircle, BookText, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Challenge = {
  question: string;
  answer: string;
  evaluation: EvaluateAnswerOutput | null;
  isEvaluating: boolean;
};

interface ChallengeMeProps {
  document: Document;
}

export function ChallengeMe({ document }: ChallengeMeProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getChallenges = async () => {
      setIsLoading(true);
      const questions = await generateChallengeQuestionsAction(document.content);
      setChallenges(
        questions.map((q) => ({
          question: q,
          answer: '',
          evaluation: null,
          isEvaluating: false,
        }))
      );
      setIsLoading(false);
    };

    getChallenges();
  }, [document.content]);

  const handleAnswerChange = (index: number, value: string) => {
    const newChallenges = [...challenges];
    newChallenges[index].answer = value;
    setChallenges(newChallenges);
  };

  const handleSubmit = async (index: number) => {
    if (!challenges[index].answer.trim()) return;

    const newChallenges = [...challenges];
    newChallenges[index].isEvaluating = true;
    setChallenges(newChallenges);

    const result = await evaluateAnswerAction({
      documentContent: document.content,
      question: challenges[index].question,
      answer: challenges[index].answer,
    });

    // Use a function for the state update to ensure we have the latest state
    setChallenges(prevChallenges => {
      const finalChallenges = [...prevChallenges];
      finalChallenges[index].evaluation = result;
      finalChallenges[index].isEvaluating = false;
      return finalChallenges;
    });
  };

  return (
    <Card className="h-full flex flex-col shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Ready for a Challenge?</CardTitle>
        <CardDescription>Let's see how well you understood the document. Give these questions a try!</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-y-auto p-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-2">
            {challenges.map((challenge, index) => (
              <AccordionItem value={`item-${index}`} key={index} className="border-b-0">
                <AccordionTrigger className="p-3 bg-muted rounded-lg hover:no-underline [&[data-state=open]]:rounded-b-none text-left">
                  <div className="flex items-center gap-3 w-full">
                    {challenge.evaluation ? (
                      challenge.evaluation.isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-500 shrink-0" />
                      )
                    ) : (
                      <div className="h-5 w-5 bg-background dark:bg-secondary rounded-full shrink-0 border" />
                    )}
                    <span className="flex-1">{challenge.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 border border-t-0 rounded-b-lg bg-card">
                  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(index); }} className="space-y-4">
                    <Input
                      placeholder="Your answer..."
                      value={challenge.answer}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      disabled={challenge.isEvaluating || !!challenge.evaluation}
                    />
                    <Button type="submit" disabled={!challenge.answer.trim() || challenge.isEvaluating || !!challenge.evaluation}>
                      {challenge.isEvaluating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Check Answer
                    </Button>
                  </form>
                  {challenge.evaluation && (
                    <div className="mt-4 p-3 rounded-md bg-muted/50">
                      <h4 className="font-semibold flex items-center gap-2">
                        {challenge.evaluation.isCorrect ? (
                          <ThumbsUp className="h-4 w-4 text-green-600 dark:text-green-500" />
                        ) : (
                          <ThumbsDown className="h-4 w-4 text-red-600 dark:text-red-500" />
                        )}
                        Evaluation
                      </h4>
                      <p className="text-sm mt-2 text-muted-foreground">{challenge.evaluation.feedback}</p>
                      {challenge.evaluation.reference && (
                         <div className="mt-2 pt-2 border-t text-xs text-muted-foreground flex items-center gap-1.5">
                            <BookText className="h-3 w-3" />
                            Reference: {challenge.evaluation.reference}
                        </div>
                      )}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
