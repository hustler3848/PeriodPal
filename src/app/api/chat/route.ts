
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  Content,
} from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse, Message } from 'ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const runtime = 'edge';

// Converts the Vercel AI SDK message history to the format expected by the Google Generative AI SDK
const buildHistory = (messages: Message[]): Content[] => {
  return messages
    .filter(
      (message) => message.role === 'user' || message.role === 'assistant'
    )
    .map((message) => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }],
    }));
};

export async function POST(req: Request) {
  try {
    const { messages, region } = await req.json();

    // Validate inputs
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response('Invalid or empty messages format', { status: 400 });
    }
     if (!region || typeof region !== 'string') {
      return new Response('Region is required', { status: 400 });
    }
    if (!process.env.GEMINI_API_KEY) {
      return new Response('API key not configured', { status: 500 });
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'user') {
       return new Response('Last message must be from the user', { status: 400 });
    }

    const system_prompt = `You are an AI chatbot named PeriodPal. You are designed to answer questions about menstrual health with empathy, accuracy, and care. Your tone should be friendly, reassuring, and supportive.

    **IMPORTANT: Keep your answers concise and easy to read. Provide brief descriptions and use bullet points only if absolutely necessary for clarity.**

    You should be able to answer questions related to the following topics:
    - Managing period cramps (e.g., "How to manage cramps?")
    - First period advice (e.g., "I got my first period, what should I do?")
    - Finding emergency products (e.g., "I don't have pads")
    - Reusable vs. disposable products (e.g., "What is better, reusable or disposable pads?")
    - Hygiene tips (e.g., "How to stay clean during periods?")

    If a question is outside of this scope, or if you don't understand it, respond with: "I'm here to help! Sorry, I didn't understand that. Try rephrasing or check our offline FAQ."

    Always prioritize safety and advise users to consult a doctor for medical concerns.

    IMPORTANT: The user is from the '${region}' region. Adapt your tone, examples, and cultural references to be respectful and relevant to this region. Avoid making assumptions, but be mindful of potential cultural sensitivities or common local beliefs when framing your answer.
    `;
    
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
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
    
    // Get the chat history, excluding the last user message
    const history = buildHistory(messages.slice(0, -1));

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash', 
      safetySettings,
      systemInstruction: system_prompt,
    });

    const chat = model.startChat({
        history: history,
    });
    
    const stream = await chat.sendMessageStream(lastMessage.content);
    
    const googleStream = GoogleGenerativeAIStream(stream);

    return new StreamingTextResponse(googleStream);

  } catch (error) {
    console.error('Error in chat API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
