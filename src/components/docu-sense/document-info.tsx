'use client';

import { useEffect, useState } from 'react';
import type { Document } from '@/app/page';
import { generateSummaryAction } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface DocumentInfoProps {
  document: Document;
}

export function DocumentInfo({ document }: DocumentInfoProps) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSummary = async () => {
      setIsLoading(true);
      const result = await generateSummaryAction(document.content);
      setSummary(result.summary);
      setIsLoading(false);
    };

    getSummary();
  }, [document.content]);

  return (
    <Card className="flex-1 flex flex-col overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline">Document Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 overflow-hidden">
        <div>
          <h3 className="font-semibold mb-2">AI Summary</h3>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <CardDescription>{summary}</CardDescription>
          )}
        </div>
        <Separator />
        <div className="flex-1 flex flex-col overflow-hidden">
          <h3 className="font-semibold mb-2">Full Text</h3>
          <ScrollArea className="flex-1 pr-4">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{document.content}</p>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
