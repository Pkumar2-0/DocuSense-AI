'use client';

import { useState } from 'react';
import { UploadView } from '@/components/docu-sense/upload-view';
import { MainView } from '@/components/docu-sense/main-view';
import { useToast } from "@/hooks/use-toast"

export type Document = {
  name: string;
  content: string;
};

export default function Home() {
  const [document, setDocument] = useState<Document | null>(null);
  const { toast } = useToast()

  const handleDocumentUpload = (file: File) => {
    if (file.type !== 'text/plain') {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a .txt file.",
      })
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setDocument({ name: file.name, content });
    };
    reader.onerror = () => {
       toast({
        variant: "destructive",
        title: "Error Reading File",
        description: "Could not read the selected file.",
      })
    }
    reader.readAsText(file);
  };
  
  const handleReset = () => {
    setDocument(null);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {document ? (
        <MainView document={document} onReset={handleReset} />
      ) : (
        <UploadView onUpload={handleDocumentUpload} />
      )}
    </main>
  );
}
