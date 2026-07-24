import { NextRequest, NextResponse } from 'next/server';
import { apiActor } from '@/lib/governance/http';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const actor = await apiActor();
    const { prompt } = await request.json();
    if (typeof prompt !== 'string' || !prompt.trim()) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL;
    const baseUrl = process.env.OPENROUTER_BASE_URL;
    if (!apiKey || !model || !baseUrl) return NextResponse.json({ error: 'OpenRouter runtime is not configured' }, { status: 503 });
    const provider = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          { role: 'system', content: 'Review legal operations runtime readiness. Return concise risks, evidence gaps, next actions, uncertainty, and a mandatory lawyer review gate. Do not provide legal advice.' },
          { role: 'user', content: prompt.trim() },
        ],
      }),
    });
    if (!provider.ok) return NextResponse.json({ error: `OpenRouter returned ${provider.status}` }, { status: 502 });
    const payload = await provider.json();
    const output = String(payload?.choices?.[0]?.message?.content || '').trim();
    if (!output) return NextResponse.json({ error: 'OpenRouter returned an empty response' }, { status: 502 });
    const result = await prisma.runtimeAiResult.create({
      data: {
        userId: actor.id,
        feature: 'legal-runtime-readiness',
        input: { prompt: prompt.trim() },
        output,
        model,
        providerResponseId: payload.id || null,
      },
    });
    return NextResponse.json({ id: result.id, response: output, model, provider: 'openrouter', providerResponseId: payload.id || null });
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') return NextResponse.json({ error: error.message }, { status: 401 });
    return NextResponse.json({ error: 'Runtime readiness analysis failed' }, { status: 500 });
  }
}
