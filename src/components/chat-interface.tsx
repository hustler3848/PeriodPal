'use client';

import { answerMenstrualHealthQuestion } from '@/ai/flows/answer-menstrual-health-question';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Heart, LoaderCircle, Mic, SendHorizonal, User } from 'lucide-react';
import React, { FormEvent, useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

// Check for SpeechRecognition API
const SpeechRecognition =
  (typeof window !== 'undefined' && window.SpeechRecognition) ||
  (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition);

export default function ChatInterface({ faqs }: { faqs: string[] }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Online/Offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    // Speech Recognition setup
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSubmit(undefined, transcript);
        stopListening();
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        toast({
          variant: 'destructive',
          title: 'Voice Error',
          description: 'Could not recognize speech. Please try again or type your message.',
        });
        stopListening();
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleFaqClick = (question: string) => {
    if (isLoading) return;
    handleSubmit(undefined, question);
  };

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>, question?: string) => {
    if (e) e.preventDefault();
    const userMessage = question || input;
    if (!userMessage.trim()) return;

    if (!isOnline) {
       toast({
          variant: 'destructive',
          title: 'You are offline',
          description: 'Please check your internet connection to use the chat.',
        });
        return;
    }

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
        text: 'I’m here to help! Sorry, I didn’t understand that. Try rephrasing or check our offline FAQ.',
        sender: 'ai',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto p-4">
      <div className="flex-1 space-y-6 overflow-y-auto pr-2 pb-4">
        {messages.length === 0 && (
          <div className="text-center p-8">
            {!isOnline && (
                 <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg">
                    <p className="font-semibold">You are currently offline.</p>
                    <p className="text-sm">The AI chat is disabled, but you can still view common questions.</p>
                 </div>
            )}
            <h2 className="text-xl font-semibold mb-4 font-headline">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {faqs.map((faq, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="p-4 h-auto text-left justify-start text-base"
                  onClick={() => handleFaqClick(faq)}
                  disabled={!isOnline}
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
              <Avatar className="w-9 h-9 border-2 border-primary">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Heart className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn('max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-3.5 shadow', {
                'bg-primary text-primary-foreground rounded-br-none': message.sender === 'user',
                'bg-card text-card-foreground rounded-bl-none': message.sender === 'ai',
              })}
            >
              <p className="whitespace-pre-wrap text-base">{message.text}</p>
            </div>
            {message.sender === 'user' && (
              <Avatar className="w-9 h-9 border">
                <AvatarFallback>
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <Avatar className="w-9 h-9 border-2 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Heart className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-card text-card-foreground rounded-2xl rounded-bl-none p-3.5 shadow">
              <LoaderCircle className="w-5 h-5 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-auto flex items-center gap-2 border-t pt-4 bg-background">
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={isListening ? "Listening..." : "Ask about menstrual health..."}
          className="flex-1 resize-none rounded-full"
          rows={1}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          disabled={isLoading || !isOnline}
        />
        {SpeechRecognition && (
            <Button type="button" size="icon" variant={isListening ? "destructive" : "secondary"} className="rounded-full w-10 h-10" onClick={isListening ? stopListening : startListening} disabled={isLoading || !isOnline}>
                <Mic className="h-5 w-5" />
                <span className="sr-only">{isListening ? "Stop listening" : "Start listening"}</span>
            </Button>
        )}
        <Button type="submit" size="icon" className="rounded-full w-10 h-10" disabled={isLoading || !input.trim() || !isOnline}>
          <SendHorizonal className="h-5 w-5" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
