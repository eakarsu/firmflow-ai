import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const timeEntries = await prisma.timeEntry.findMany({
    include: {
      case: {
        include: {
          client: true,
        },
      },
      user: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  return NextResponse.json(timeEntries);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const newTimeEntry = await prisma.timeEntry.create({
    data: {
      caseId: body.caseId,
      userId: body.userId || session.user.id,
      description: body.description,
      date: new Date(body.date),
      hours: parseFloat(body.hours),
      billable: body.billable !== false,
      billingRate: body.billingRate ? parseFloat(body.billingRate) : 0,
    },
  });

  return NextResponse.json(newTimeEntry, { status: 201 });
}
