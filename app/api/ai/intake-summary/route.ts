import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { callOpenRouter, AI_DISCLAIMER } from '@/lib/openRouterClient';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { intakeData } = body;

    if (!intakeData) {
      return NextResponse.json(
        { error: 'intakeData is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a legal assistant helping lawyers quickly understand new client intake forms. Your task is to:
1. Summarize the key facts from the intake form in a concise, lawyer-friendly format
2. Identify potential legal issues and areas of concern
3. Flag any missing information that should be collected

Format your response as:
## Summary
[Brief overview of the matter]

## Key Facts
- [Bullet points of important facts]

## Potential Legal Issues
- [Bullet points of issues to consider]

## Missing Information
- [Bullet points of gaps to fill]

Be concise, professional, and focus on legally relevant information.`;

    const userPrompt = `Please analyze this client intake information:\n\n${JSON.stringify(intakeData, null, 2)}`;

    const aiResponse = await callOpenRouter({
      systemPrompt,
      userPrompt,
      temperature: 0.3,
      maxTokens: 2000,
    });

    return NextResponse.json({
      summary: aiResponse.text + AI_DISCLAIMER,
      usage: aiResponse.usage,
    });
  } catch (error) {
    console.error('AI Intake Summary error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
