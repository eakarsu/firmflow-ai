import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const caseData = await prisma.case.findUnique({
    where: { id },
    include: {
      client: true,
      responsibleLawyer: true,
      tasks: {
        orderBy: { dueDate: 'asc' },
      },
      timeEntries: {
        include: { user: true },
        orderBy: { date: 'desc' },
      },
      documents: {
        orderBy: { createdAt: 'desc' },
      },
      courtFilings: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!caseData) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 });
  }

  return NextResponse.json(caseData);
}
