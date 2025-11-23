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
    const { metrics } = body;

    if (!metrics) {
      return NextResponse.json(
        { error: 'metrics object is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a law firm management consultant analyzing practice metrics. Your task is to provide actionable insights based on KPIs.

Guidelines:
- Identify trends and patterns in the data
- Highlight areas of strength and concern
- Provide specific, actionable recommendations
- Compare metrics to industry benchmarks when relevant
- Use clear, business-focused language
- Organize insights by category (financial, productivity, client service)
- Be constructive and solution-oriented

Format your response with clear sections and bullet points.`;

    const userPrompt = `Please analyze these law firm metrics and provide insights:

${JSON.stringify(metrics, null, 2)}

Provide:
1. Key observations
2. Areas of concern
3. Opportunities for improvement
4. Specific recommendations`;

    const aiResponse = await callOpenRouter({
      systemPrompt,
      userPrompt,
      temperature: 0.4,
      maxTokens: 2500,
    });

    return NextResponse.json({
      insights: aiResponse.text.trim(),
      usage: aiResponse.usage,
    });
  } catch (error) {
    console.error('AI KPI Insights error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
