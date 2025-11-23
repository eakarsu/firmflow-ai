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
    const { filingType, jurisdiction, caseType } = body;

    if (!filingType) {
      return NextResponse.json(
        { error: 'filingType is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a legal filing assistant. Your task is to generate a comprehensive checklist for court filings.

IMPORTANT: This is a general guidance checklist only. Court rules vary by jurisdiction and change frequently. Always verify current local rules and requirements.

Guidelines:
- Provide a detailed, step-by-step checklist
- Include common requirements (formatting, copies, fees, etc.)
- Note common deadlines and timing requirements
- Flag jurisdiction-specific items that need verification
- Organize logically (preparation → filing → follow-up)
- Use clear, actionable items
- Include reminders about service requirements

Format as markdown with checkboxes.`;

    const userPrompt = `Please generate a filing checklist for:

Filing Type: ${filingType}
${jurisdiction ? `Jurisdiction: ${jurisdiction}` : ''}
${caseType ? `Case Type: ${caseType}` : ''}`;

    const aiResponse = await callOpenRouter({
      systemPrompt,
      userPrompt,
      temperature: 0.3,
      maxTokens: 2000,
    });

    return NextResponse.json({
      checklist: aiResponse.text + AI_DISCLAIMER,
      usage: aiResponse.usage,
    });
  } catch (error) {
    console.error('AI Filing Checklist error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate filing checklist' },
      { status: 500 }
    );
  }
}
