'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Lightbulb } from 'lucide-react';
import { AskAnything } from './ask-anything';
import { ChallengeMe } from './challenge-me';
import type { Document } from '@/app/page';

interface InteractionTabsProps {
  document: Document;
}

export function InteractionTabs({ document }: InteractionTabsProps) {
  return (
    <Tabs defaultValue="ask" className="w-full flex-1 flex flex-col overflow-hidden">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="ask">
          <MessageSquare className="mr-2 h-4 w-4" />
          Ask Anything
        </TabsTrigger>
        <TabsTrigger value="challenge">
          <Lightbulb className="mr-2 h-4 w-4" />
          Challenge Me
        </TabsTrigger>
      </TabsList>
      <TabsContent value="ask" className="flex-1 overflow-hidden">
        <AskAnything document={document} />
      </TabsContent>
      <TabsContent value="challenge" className="flex-1 overflow-hidden">
        <ChallengeMe document={document} />
      </TabsContent>
    </Tabs>
  );
}
