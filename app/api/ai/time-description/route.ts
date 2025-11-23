import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { callOpenRouter } from '@/lib/openRouterClient';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { rawNotes, caseContext } = body;

    if (!rawNotes) {
      return NextResponse.json(
        { error: 'rawNotes is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a legal billing assistant. Your task is to transform rough time entry notes into professional, billable descriptions.

Guidelines:
- Use professional, client-friendly language
- Be specific about the work performed
- Use active voice and proper legal terminology
- Keep descriptions concise (1-2 sentences typically)
- Focus on value provided, not just tasks
- Avoid overly casual language
- Include relevant details (e.g., "drafted motion for summary judgment" not just "drafted motion")

Output only the polished time entry description, nothing else.`;

    const userPrompt = `Please polish these time entry notes into a professional billing description:

${rawNotes}

${caseContext ? `\nCase context: ${caseContext}` : ''}`;

    const aiResponse = await callOpenRouter({
      systemPrompt,
      userPrompt,
      temperature: 0.3,
      maxTokens: 500,
    });

    return NextResponse.json({
      description: aiResponse.text.trim(),
      usage: aiResponse.usage,
    });
  } catch (error) {
    console.error('AI Time Description error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to polish time entry' },
      { status: 500 }
    );
  }
}
