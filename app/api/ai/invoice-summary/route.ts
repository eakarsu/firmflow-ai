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
    const { timeEntries, caseTitle, clientName } = body;

    if (!timeEntries || !Array.isArray(timeEntries)) {
      return NextResponse.json(
        { error: 'timeEntries array is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a legal billing specialist. Your task is to generate a professional invoice narrative that summarizes the work performed.

Guidelines:
- Write in a professional, client-friendly tone
- Organize work chronologically or by category
- Highlight key achievements and milestones
- Use clear, non-technical language where possible
- Create a cohesive narrative, not just a list
- Keep it concise but informative (2-4 paragraphs typically)
- Focus on value delivered to the client

The output will appear as a cover letter or summary section on the invoice.`;

    const timeEntriesText = timeEntries
      .map((entry: any, idx: number) =>
        `${idx + 1}. ${entry.date ? new Date(entry.date).toLocaleDateString() : ''} - ${entry.description} (${entry.hours} hours)`
      )
      .join('\n');

    const userPrompt = `Please generate a professional invoice summary narrative for the following work:

${caseTitle ? `Case: ${caseTitle}` : ''}
${clientName ? `Client: ${clientName}` : ''}

Time Entries:
${timeEntriesText}`;

    const aiResponse = await callOpenRouter({
      systemPrompt,
      userPrompt,
      temperature: 0.4,
      maxTokens: 1500,
    });

    return NextResponse.json({
      narrative: aiResponse.text.trim(),
      summary: aiResponse.text.trim(), // Keep for backwards compatibility
      usage: aiResponse.usage,
    });
  } catch (error) {
    console.error('AI Invoice Summary error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate invoice summary' },
      { status: 500 }
    );
  }
}
