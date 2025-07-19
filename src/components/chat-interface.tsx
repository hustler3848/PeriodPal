'use client';

import { answerMenstrualHealthQuestion } from '@/ai/flows/answer-menstrual-health-question';
import { translateText } from '@/ai/flows/translate-text';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Globe, Heart, LoaderCircle, Mic, SendHorizonal, User } from 'lucide-react';
import React, { FormEvent, useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

interface ChatHistory {
  messages: Message[];
  language: string;
}

// Check for SpeechRecognition API
const SpeechRecognition =
  (typeof window !== 'undefined' && window.SpeechRecognition) ||
  (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition);

const CHAT_STORAGE_KEY = 'periodpal-chat-history-v2';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'pt', label: 'Português' },
];

export default function ChatInterface({ faqs }: { faqs: string[] }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [language, setLanguage] = useState<string>('en');
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedHistory = localStorage.getItem(CHAT_STORAGE_KEY);
        if (savedHistory) {
          const { messages: savedMessages, language: savedLanguage } = JSON.parse(savedHistory) as ChatHistory;
          setMessages(savedMessages || []);
          setLanguage(savedLanguage || 'en');
        }
      } catch (error) {
        console.error('Error reading chat history from localStorage', error);
      }
    }
  }, []);

  useEffect(() => {
    try {
      const chatHistory: ChatHistory = { messages, language };
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatHistory));
    } catch (error) {
      console.error('Error saving chat history to localStorage', error);
    }
  }, [messages, language]);

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
  }, [toast, language]);
  
  useEffect(() => {
    if (recognitionRef.current) {
        recognitionRef.current.lang = language;
    }
  }, [language]);


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

  const handleFaqClick = async (question: string) => {
    if (isLoading) return;

    if (language !== 'en') {
        setIsLoading(true);
        try {
            const translatedQuestion = await translateText({ text: question, targetLanguage: language });
            handleSubmit(undefined, translatedQuestion.translatedText);
        } catch (error) {
            console.error('Error translating FAQ:', error);
            toast({ variant: 'destructive', title: 'Translation Error', description: 'Could not translate the question.' });
            setIsLoading(false);
        }
    } else {
        handleSubmit(undefined, question);
    }
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
      // 1. Translate user message to English if needed
      const questionInEnglish = language === 'en'
        ? userMessage
        : (await translateText({ text: userMessage, targetLanguage: 'en' })).translatedText;

      // 2. Get answer in English
      const result = await answerMenstrualHealthQuestion({ question: questionInEnglish });
      let answerInTargetLanguage = result.answer;

      // 3. Translate answer back to user's language if needed
      if (language !== 'en') {
        answerInTargetLanguage = (await translateText({ text: result.answer, targetLanguage: language })).translatedText;
      }
      
      const aiMessage: Message = { id: (Date.now() + 1).toString(), text: answerInTargetLanguage, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error in chat submission flow:', error);
      let errorMessageText = 'I’m here to help! Sorry, something went wrong. Try rephrasing or check our offline FAQ.';
      if (language !== 'en') {
          try {
              errorMessageText = (await translateText({ text: errorMessageText, targetLanguage: language })).translatedText;
          } catch (translateError) {
              // Ignore if even the error message translation fails
          }
      }
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessageText,
        sender: 'ai',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    // Optionally clear chat history on language change
    // setMessages([]);
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold font-headline">AI Assistant</h2>
         <Select value={language} onValueChange={handleLanguageChange}>
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
              {faqs.map((faq, index) => (
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
