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

  const timeEntry = await prisma.timeEntry.findUnique({
    where: { id },
    include: {
      case: {
        include: {
          client: true,
        },
      },
      user: true,
    },
  });

  if (!timeEntry) {
    return NextResponse.json({ error: 'Time entry not found' }, { status: 404 });
  }

  return NextResponse.json(timeEntry);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const updatedTimeEntry = await prisma.timeEntry.update({
    where: { id },
    data: {
      description: body.description,
      date: new Date(body.date),
      hours: parseFloat(body.hours),
      billable: body.billable !== false,
      billingRate: body.billingRate ? parseFloat(body.billingRate) : 0,
    },
  });

  return NextResponse.json(updatedTimeEntry);
}
