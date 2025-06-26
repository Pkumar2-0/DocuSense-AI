'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from '@uploadthing/react';
import { BrainCircuit, UploadCloud, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface UploadViewProps {
  onUpload: (file: File) => void;
}

export function UploadView({ onUpload }: UploadViewProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsDragging(false);
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'text/plain': ['.txt'], 'application/pdf': ['.pdf'] },
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-muted/30 dark:bg-card">
      <div className="flex items-center gap-4 mb-8">
        <BrainCircuit className="h-12 w-12 text-primary" />
        <h1 className="text-5xl font-bold font-headline text-center">DocuSense AI</h1>
      </div>
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Let's Get Started</CardTitle>
          <CardDescription>Upload a document to begin interacting with its content.</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors duration-300 group',
              isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <UploadCloud className={cn('w-16 h-16 transition-colors', isDragging ? 'text-primary' : 'group-hover:text-primary/80')} />
              <p className="text-lg font-medium">
                {isDragging ? 'Drop the file here!' : "Drag 'n' drop a file, or click to select"}
              </p>
              <p className="text-sm">Supported formats: TXT & PDF</p>
            </div>
          </div>
          <Button onClick={open} className="w-full mt-6" size="lg">
            <FileUp className="mr-2 h-5 w-5" />
            Choose a File
          </Button>
        </CardContent>
      </Card>
      <footer className="mt-12 text-center text-muted-foreground text-sm">
        <p>Powered by Generative AI</p>
      </footer>
    </div>
  );
}
