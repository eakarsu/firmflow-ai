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
    const { documentType, caseContext, instructions } = body;

    if (!documentType || !instructions) {
      return NextResponse.json(
        { error: 'documentType and instructions are required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert legal document drafter. Your task is to draft professional legal documents based on the provided context and instructions.

Important guidelines:
- Use appropriate legal terminology and formatting
- Include standard clauses and provisions relevant to the document type
- Mark sections that need customization with [CUSTOMIZE: ...]
- Use professional tone and clear language
- Include proper headings and numbering
- Follow standard legal document structure

Remember: This is a draft template that MUST be reviewed and customized by a licensed attorney.`;

    const userPrompt = `Please draft a ${documentType} document.

${caseContext ? `Case Context:\n${caseContext}\n\n` : ''}Instructions:
${instructions}`;

    const aiResponse = await callOpenRouter({
      systemPrompt,
      userPrompt,
      temperature: 0.5,
      maxTokens: 4000,
    });

    return NextResponse.json({
      draft: aiResponse.text + AI_DISCLAIMER,
      usage: aiResponse.usage,
    });
  } catch (error) {
    console.error('AI Document Drafting error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to draft document' },
      { status: 500 }
    );
  }
}
