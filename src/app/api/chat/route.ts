
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerateContentRequest,
} from '@google/generative-ai';
import { GoogleAIStream } from 'ai/google';
import { StreamingTextResponse, Message } from 'ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const runtime = 'edge';

const buildChatPrompt = (messages: Message[], region: string) => {
  const system_prompt = `You are an AI chatbot named PeriodPal. You are designed to answer questions about menstrual health with empathy, accuracy, and care. Your tone should be friendly, reassuring, and supportive.

  You should be able to answer questions related to the following topics:
  - Managing period cramps (e.g., "How to manage cramps?")
  - First period advice (e.g., "I got my first period, what should I do?")
  - Finding emergency products (e.g., "I don’t have pads")
  - Reusable vs. disposable products (e.g., "What is better, reusable or disposable pads?")
  - Hygiene tips (e.g., "How to stay clean during periods?")

  If a question is outside of this scope, or if you don't understand it, respond with: "I’m here to help! Sorry, I didn’t understand that. Try rephrasing or check our offline FAQ."

  Always prioritize safety and advise users to consult a doctor for medical concerns.

  IMPORTANT: The user is from the '${region}' region. Adapt your tone, examples, and cultural references to be respectful and relevant to this region. Avoid making assumptions, but be mindful of potential cultural sensitivities or common local beliefs when framing your answer.
  `;

  // The first message is the system prompt, the second is a starter model response.
  const prompt: GenerateContentRequest['contents'] = [
    {
      role: 'user',
      parts: [{ text: system_prompt }],
    },
    {
      role: 'model',
      parts: [{ text: 'I am ready to help.' }],
    },
  ];

  // Add the rest of the conversation history
  messages.forEach(message => {
    if (message.role === 'user' || message.role === 'assistant') {
        prompt.push({
            role: message.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: message.content }],
        });
    }
  });

  return prompt;
};


export async function POST(req: Request) {
  const { messages, region } = await req.json();

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];
  
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', safetySettings });

  const contents = buildChatPrompt(messages, region);

  const geminiStream = await model.generateContentStream({
    contents,
  });

  const stream = GoogleAIStream(geminiStream);

  return new StreamingTextResponse(stream);
}
