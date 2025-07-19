'use client';

import { answerMenstrualHealthQuestion } from '@/ai/flows/answer-menstrual-health-question';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Heart, LoaderCircle, SendHorizonal, User } from 'lucide-react';
import React, { FormEvent, useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export default function ChatInterface({ faqs }: { faqs: string[] }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFaqClick = (question: string) => {
    if (isLoading) return;
    handleSubmit(undefined, question);
  };

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>, question?: string) => {
    if (e) e.preventDefault();
    const userMessage = question || input;
    if (!userMessage.trim()) return;

    const newUserMessage: Message = { id: Date.now().toString(), text: userMessage, sender: 'user' };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await answerMenstrualHealthQuestion({ question: userMessage });
      const aiMessage: Message = { id: (Date.now() + 1).toString(), text: result.answer, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto p-4">
      <div className="flex-1 space-y-6 overflow-y-auto pr-2">
        {messages.length === 0 && (
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {faqs.map((faq, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="p-4 h-auto text-left justify-start"
                  onClick={() => handleFaqClick(faq)}
                >
                  {faq}
                </Button>
              ))}
            </div>
          </div>
        )}
        {messages.map(message => (
          <div
            key={message.id}
            className={cn('flex items-start gap-3', { 'justify-end': message.sender === 'user' })}
          >
            {message.sender === 'ai' && (
              <Avatar className="w-8 h-8 border-2 border-primary">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Heart className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn('max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-3.5', {
                'bg-primary text-primary-foreground rounded-br-none': message.sender === 'user',
                'bg-card text-card-foreground rounded-bl-none shadow-sm': message.sender === 'ai',
              })}
            >
              <p className="whitespace-pre-wrap">{message.text}</p>
            </div>
            {message.sender === 'user' && (
              <Avatar className="w-8 h-8 border">
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8 border-2 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Heart className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-card text-card-foreground rounded-2xl rounded-bl-none p-3.5 shadow-sm">
              <LoaderCircle className="w-5 h-5 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2 border-t pt-4">
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about menstrual health..."
          className="flex-1 resize-none rounded-full"
          rows={1}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          disabled={isLoading}
        />
        <Button type="submit" size="icon" className="rounded-full w-10 h-10" disabled={isLoading || !input.trim()}>
          <SendHorizonal className="h-5 w-5" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
