import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cases = await prisma.case.findMany({
    include: {
      client: true,
      responsibleLawyer: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json(cases);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const newCase = await prisma.case.create({
    data: {
      title: body.title,
      description: body.description,
      clientId: body.clientId,
      responsibleLawyerId: body.responsibleLawyerId,
      status: body.status,
      practiceArea: body.practiceArea,
      courtName: body.courtName || null,
      courtFileNumber: body.courtFileNumber || null,
    },
  });

  return NextResponse.json(newCase, { status: 201 });
}
