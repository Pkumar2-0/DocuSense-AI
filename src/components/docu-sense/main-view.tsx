'use client';

import type { Document } from '@/app/page';
import { BrainCircuit, FileText, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentInfo } from './document-info';
import { AskAnything } from './ask-anything';
import { ChallengeMe } from './challenge-me';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useState } from 'react';

interface MainViewProps {
  document: Document;
  onReset: () => void;
}

export function MainView({ document, onReset }: MainViewProps) {
  const [isChallengeSheetOpen, setChallengeSheetOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-muted/30 dark:bg-card">
      <header className="flex items-center justify-between p-3 border-b bg-background shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline">DocuSense AI</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
          <FileText className="h-4 w-4" />
          <span className="font-medium truncate max-w-xs">{document.name}</span>
        </div>
        <div className="flex items-center gap-2">
           <Button onClick={() => setChallengeSheetOpen(true)} variant="outline">
            <Lightbulb className="mr-2 h-4 w-4" />
            Challenge Me
          </Button>
          <Button onClick={onReset}>
            Upload New
          </Button>
        </div>
      </header>

      <main className="flex-1 grid lg:grid-cols-3 gap-4 p-4 overflow-hidden">
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-hidden">
          <DocumentInfo document={document} />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
          <AskAnything document={document} />
        </div>
      </main>

      <Sheet open={isChallengeSheetOpen} onOpenChange={setChallengeSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col" side="right">
            <SheetHeader className="p-6 pb-4 border-b">
                <SheetTitle className="font-headline">Challenge Me</SheetTitle>
                <SheetDescription>Test your comprehension with these AI-generated questions.</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6 bg-muted/30 dark:bg-card">
                <ChallengeMe document={document} />
            </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
