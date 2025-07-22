
'use client';

import { translate } from '@/app/actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useSettings } from '@/context/settings-provider';
import { useToast } from '@/hooks/use-toast';
import { localizations } from '@/lib/localization';
import { cn } from '@/lib/utils';
import { Globe, Heart, LoaderCircle, Mic, SendHorizonal, User } from 'lucide-react';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useChat, type Message } from 'ai/react';

interface ChatHistory {
  messages: Message[];
  language: string;
}

// Check for SpeechRecognition API
const SpeechRecognition =
  (typeof window !== 'undefined' && window.SpeechRecognition) ||
  (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition);

const CHAT_STORAGE_KEY = 'periodpal-chat-history-v2';

export default function ChatInterface() {
  const { region, language, setLanguage, isInitialized } = useSettings();
  
  const [isListening, setIsListening] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [translatedFaqs, setTranslatedFaqs] = useState<string[]>([]);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { messages, setMessages, input, setInput, handleSubmit, isLoading } = useChat({
      api: '/api/chat',
      body: {
          region: region
      },
      onError: (error) => {
          console.error('Error in chat submission flow:', error);
          toast({ variant: 'destructive', title: 'Error', description: 'Sorry, something went wrong. Please try again.' });
      },
  });

  const faqs = localizations[region].faqs;
  const languages = localizations[region].languages;

  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      try {
        const savedHistory = localStorage.getItem(CHAT_STORAGE_KEY);
        if (savedHistory) {
          const { messages: savedMessages } = JSON.parse(savedHistory) as ChatHistory;
          setMessages(savedMessages || []);
        }
      } catch (error) {
        console.error('Error reading chat history from localStorage', error);
      }
    }
  }, [isInitialized, setMessages]);

  useEffect(() => {
    if (isInitialized) {
      try {
        const chatHistory: ChatHistory = { messages, language };
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatHistory));
      } catch (error) {
        console.error('Error saving chat history to localStorage', error);
      }
    }
  }, [messages, language, isInitialized]);
  
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
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
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
  }, [toast, language, setInput]);
  
  useEffect(() => {
    if (recognitionRef.current) {
        recognitionRef.current.lang = language;
    }
    // Translate FAQs when language changes
    const translateFaqs = async () => {
        // Always set English FAQs first as a fallback
        setTranslatedFaqs(faqs);
        if (language === 'en') {
            return;
        }
        try {
            const translated = await Promise.all(
                faqs.map(faq => translate({ text: faq, language: language }))
            );
            // Filter out any empty results before setting
            const validTranslations = translated.filter(t => t && t.trim() !== '');
            if (validTranslations.length === faqs.length) {
                setTranslatedFaqs(validTranslations);
            }
        } catch (error) {
            console.error("Failed to translate FAQs, falling back to English", error);
             toast({
              variant: 'destructive',
              title: 'Translation Error',
              description: 'Could not translate suggestions. Using default language.',
            });
        }
    };
    if (isInitialized && isOnline) {
        translateFaqs();
    } else {
        setTranslatedFaqs(faqs); // Show default on offline
    }
  }, [language, isInitialized, isOnline, faqs, toast]);


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

  const handleFaqClick = async (faq: string) => {
    if (isLoading || !isOnline) return;
    
    // Create a new user message object
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: faq,
    };
    
    // Use the useChat hook's append function
    setMessages([...messages, userMessage]);
    handleSubmit(new Event('submit') as unknown as FormEvent<HTMLFormElement>, {
        options: {
            body: {
                region,
                // Pass the specific question in the request
                // This will be added to the messages array by the useChat hook
                messages: [userMessage],
            }
        }
    });
    setInput(''); // Clear input after sending
  };
  
  if (!isInitialized) {
    return (
        <div className="flex items-center justify-center h-full">
            <LoaderCircle className="w-8 h-8 animate-spin" />
        </div>
    )
  }

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto p-4">
      <div className="flex justify-end items-center mb-4">
         <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-auto gap-2">
            <Globe className="w-4 h-4" />
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map(lang => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
            {translatedFaqs.map((faq, index) => (
                <Button
                key={index}
                variant="outline"
                className="p-4 h-auto text-left justify-start text-base"
                onClick={() => handleFaqClick(faq)}
                disabled={!isOnline || isLoading}
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
            className={cn('flex items-start gap-3', { 'justify-end': message.role === 'user' })}
          >
            {message.role === 'assistant' && (
              <Avatar className="w-9 h-9 border-2 border-primary">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Heart className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn('max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-3.5 shadow', {
                'bg-primary text-primary-foreground rounded-br-none': message.role === 'user',
                'bg-card text-card-foreground rounded-bl-none': message.role === 'assistant',
              })}
            >
              <p className="whitespace-pre-wrap text-base">{message.content}</p>
            </div>
            {message.role === 'user' && (
              <Avatar className="w-9 h-9 border">
                <AvatarFallback>
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && messages[messages.length -1]?.role === 'user' && (
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
              handleSubmit(e as any);
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
