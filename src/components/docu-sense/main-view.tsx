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
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline">DocuSense AI</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary px-3 py-1.5 rounded-lg">
          <FileText className="h-4 w-4" />
          <span className="font-medium">{document.name}</span>
        </div>
        <Button onClick={onReset} variant="outline">
          Upload New Document
        </Button>
      </header>

      <div className="flex-1 grid md:grid-cols-2 gap-4 p-4 overflow-hidden">
        <div className="flex flex-col gap-4 overflow-hidden">
          <DocumentInfo document={document} />
        </div>
        <div className="flex flex-col gap-4 overflow-hidden">
          <InteractionTabs document={document} />
        </div>
      </div>
    </div>
  );
}
