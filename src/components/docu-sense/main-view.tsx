'use client';

import type { Document } from '@/app/page';
import { BrainCircuit, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentInfo } from './document-info';
import { InteractionTabs } from './interaction-tabs';

interface MainViewProps {
  document: Document;
  onReset: () => void;
}

export function MainView({ document, onReset }: MainViewProps) {
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
          <Button onClick={onReset} variant="outline">
            Start Over
          </Button>
        </div>
      </header>

      <main className="flex-1 grid lg:grid-cols-3 gap-4 p-4 overflow-hidden">
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-hidden">
          <DocumentInfo document={document} />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
          <InteractionTabs document={document} />
        </div>
      </main>
    </div>
  );
}
