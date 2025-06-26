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
import { ScrollArea } from '../ui/scroll-area';

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
    const newChallenges = [...challenges];
    newChallenges[index].isEvaluating = true;
    setChallenges(newChallenges);

    const result = await evaluateAnswerAction({
      documentContent: document.content,
      question: challenges[index].question,
      answer: challenges[index].answer,
    });

    const finalChallenges = [...challenges];
    finalChallenges[index].evaluation = result;
    finalChallenges[index].isEvaluating = false;
    setChallenges(finalChallenges);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">Challenge Me</CardTitle>
        <CardDescription>Test your comprehension with these AI-generated questions.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4 -mr-4">
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
                <AccordionTrigger className="p-3 bg-secondary rounded-lg hover:no-underline [&[data-state=open]]:rounded-b-none">
                  <div className="flex items-center gap-3">
                    {challenge.evaluation ? (
                      challenge.evaluation.isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )
                    ) : (
                      <div className="h-5 w-5 bg-muted rounded-full" />
                    )}
                    <span className="text-left flex-1">{challenge.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 border border-t-0 rounded-b-lg">
                  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(index); }} className="space-y-4">
                    <Input
                      placeholder="Your answer..."
                      value={challenge.answer}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      disabled={challenge.isEvaluating}
                    />
                    <Button type="submit" disabled={!challenge.answer.trim() || challenge.isEvaluating}>
                      {challenge.isEvaluating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit Answer
                    </Button>
                  </form>
                  {challenge.evaluation && (
                    <div className="mt-4 p-3 rounded-md bg-secondary/50">
                      <h4 className="font-semibold flex items-center gap-2">
                        {challenge.evaluation.isCorrect ? (
                          <ThumbsUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <ThumbsDown className="h-4 w-4 text-red-600" />
                        )}
                        Evaluation Feedback
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
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
