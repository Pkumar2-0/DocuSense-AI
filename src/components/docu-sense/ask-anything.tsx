'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import type { Document } from '@/app/page';
import { askQuestionAction } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, User, Bot, BookText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

type Message = {
  id: number;
  role: 'user' | 'ai';
  content: string;
  reference?: string;
};

interface AskAnythingProps {
  document: Document;
}

export function AskAnything({ document }: AskAnythingProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const conversationHistory = messages.map(m => ({ role: m.role, content: m.content }));
    const result = await askQuestionAction(document.content, input, conversationHistory);
    
    const aiMessage: Message = {
      id: Date.now() + 1,
      role: 'ai',
      content: result.answer,
      reference: result.reference,
    };
    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <Card className="h-full flex flex-col shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Ask Anything</CardTitle>
        <CardDescription>Ask free-form questions about the document's content.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 pr-4 -mr-4 mb-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                {message.role === 'ai' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                  </Avatar>
                )}
                <div className={cn(
                    'px-4 py-3 rounded-2xl max-w-sm md:max-w-md lg:max-w-lg shadow-md',
                    message.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card border rounded-bl-none'
                  )}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                   {message.reference && (
                    <div className="mt-2 pt-2 border-t border-secondary-foreground/10 text-xs text-muted-foreground flex items-center gap-1.5">
                      <BookText className="h-3 w-3" />
                      Reference: {message.reference}
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
               <div className="flex items-start gap-3 justify-start">
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                  </Avatar>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-card border space-y-2">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-32" />
                  </div>
               </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-4 border-t">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={isLoading}
            autoComplete="off"
            className="text-base"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
