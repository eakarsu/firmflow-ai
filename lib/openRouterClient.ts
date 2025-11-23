/**
 * OpenRouter AI Client
 * Server-side only utility for calling OpenRouter API
 * Configured via environment variables
 */

interface OpenRouterRequest {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

interface OpenRouterResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export async function callOpenRouter({
  systemPrompt,
  userPrompt,
  temperature = 0.7,
  maxTokens = 4000,
}: OpenRouterRequest): Promise<OpenRouterResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';

  if (!apiKey) {
    throw new Error(
      'OPENROUTER_API_KEY is not configured. Please set it in your .env file.'
    );
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
        'X-Title': 'FirmFlow AI',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenRouter API error: ${response.status} ${response.statusText}. ${
          errorData.error?.message || ''
        }`
      );
    }

    const data = await response.json();

    const text = data.choices?.[0]?.message?.content || '';
    const usage = data.usage
      ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        }
      : undefined;

    return { text, usage };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to call OpenRouter: ${error.message}`);
    }
    throw new Error('Failed to call OpenRouter: Unknown error');
  }
}

/**
 * Helper function to check if OpenRouter is properly configured
 */
export function isOpenRouterConfigured(): boolean {
  return !!process.env.OPENROUTER_API_KEY;
}

/**
 * Legal AI disclaimer to append to all AI-generated content
 */
export const AI_DISCLAIMER = `

---

**IMPORTANT LEGAL DISCLAIMER**: This content was generated with AI assistance and is provided for drafting and administrative purposes only. It does not constitute legal advice, and its accuracy is not guaranteed. All AI-generated content must be reviewed, verified, and approved by a licensed attorney before use. Do not rely on this content without independent legal review.`;
