import Groq from 'groq-sdk';

/**
 * Initialize Groq client for LLM calls
 */
function createGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is required');
  }

  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Generate a response using Groq LLM with provided context
 */
export async function generateResponse(
  query: string,
  context: string,
  systemPrompt?: string
): Promise<string> {
  const groq = createGroqClient();

  const defaultSystemPrompt = `You are a helpful HR and company policy assistant. 
Answer questions based ONLY on the provided document context. 
If the information is not in the provided documents, say so clearly.
Be concise and professional.
If documents were excluded due to access restrictions, acknowledge this but don't speculate about their content.`;

  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: systemPrompt || defaultSystemPrompt,
    },
    {
      role: 'user',
      content: `Context from company documents:\n\n${context}\n\nQuestion: ${query}\n\nPlease answer based on the context provided above.`,
    },
  ];

  try {
    console.log('[Groq] Generating response...');
    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile', // Fast and capable model
      temperature: 0.3, // Lower temperature for more factual responses
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const response = chatCompletion.choices[0]?.message?.content || 'No response generated.';
    console.log('[Groq] Response generated successfully');
    return response;
  } catch (error) {
    console.error('[Groq] Error generating response:', error);
    throw new Error('Failed to generate response from LLM');
  }
}
