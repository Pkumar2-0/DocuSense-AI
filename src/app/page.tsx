'use client';

import { useState, useEffect } from 'react';
import { UploadView } from '@/components/docu-sense/upload-view';
import { MainView } from '@/components/docu-sense/main-view';
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from 'pdfjs-dist';

export type Document = {
  name: string;
  content: string;
};

export default function Home() {
  const [document, setDocument] = useState<Document | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Required for pdf.js to work. It sets up the worker.
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }, []);

  const handleDocumentUpload = (file: File) => {
    if (file.type === 'text/plain') {
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
        });
      };
      reader.readAsText(file);
    } else if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
          let content = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            // Using 'str' property from TextItem interface
            content += textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
            content += '\n\n'; // Add space between pages
          }
          setDocument({ name: file.name, content: content.trim() });
        } catch (error) {
          console.error("Error parsing PDF:", error);
          toast({
            variant: "destructive",
            title: "Error Parsing PDF",
            description: "Could not extract text from the PDF.",
          });
        }
      };
      reader.onerror = () => {
        toast({
          variant: "destructive",
          title: "Error Reading File",
          description: "Could not read the selected PDF file.",
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a .txt or .pdf file.",
      });
    }
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
