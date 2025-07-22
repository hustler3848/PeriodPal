import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, region } = await req.json();

    // Validate inputs
    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 });
    }

    if (!region || typeof region !== 'string') {
      return new Response('Region is required', { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return new Response('API key not configured', { status: 500 });
    }

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
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH, // Less restrictive for health content
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
    
    const system_prompt = `You are an AI chatbot named PeriodPal. You are designed to answer questions about menstrual health with empathy, accuracy, and care. Your tone should be friendly, reassuring, and supportive.

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

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash', 
      systemInstruction: system_prompt,
      safetySettings 
    });

    // Convert messages to Gemini format
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const stream = await model.generateContentStream({
      contents,
    });

    // Use the correct function name for Google AI streaming
    const googleStream = GoogleGenerativeAIStream(stream);

    return new StreamingTextResponse(googleStream);

  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}