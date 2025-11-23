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
    const { clauseType, context } = body;

    if (!clauseType) {
      return NextResponse.json(
        { error: 'clauseType is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert legal clause drafter. Your task is to generate specific legal clauses that can be inserted into documents.

Important guidelines:
- Draft professional, legally sound clauses
- Use clear and precise language
- Include standard provisions for the clause type
- Mark optional sections or variations with [OPTIONAL: ...]
- Mark sections requiring customization with [CUSTOMIZE: ...]
- Keep clauses concise but comprehensive
- Use proper legal formatting and numbering

Output only the clause text, ready to be inserted into a document.`;

    const userPrompt = `Please draft a ${clauseType} clause.

${context ? `Context:\n${context}` : ''}`;

    const aiResponse = await callOpenRouter({
      systemPrompt,
      userPrompt,
      temperature: 0.4,
      maxTokens: 2000,
    });

    return NextResponse.json({
      clause: aiResponse.text + AI_DISCLAIMER,
      usage: aiResponse.usage,
    });
  } catch (error) {
    console.error('AI Clause Generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate clause' },
      { status: 500 }
    );
  }
}
