import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const invoices = await prisma.invoice.findMany({
    include: {
      case: {
        include: {
          client: true,
        },
      },
      client: true,
      timeEntries: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json(invoices);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const newInvoice = await prisma.invoice.create({
    data: {
      caseId: body.caseId,
      clientId: body.clientId,
      invoiceNumber: body.invoiceNumber,
      issueDate: new Date(body.issueDate),
      dueDate: new Date(body.dueDate),
      status: body.status || 'DRAFT',
      totalAmount: parseFloat(body.totalAmount),
      aiNarrative: body.aiNarrative || null,
    },
  });

  return NextResponse.json(newInvoice, { status: 201 });
}
