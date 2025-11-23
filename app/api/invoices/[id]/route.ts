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

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      case: {
        include: {
          client: true,
          responsibleLawyer: true,
          timeEntries: {
            include: {
              user: true,
            },
          },
        },
      },
      client: true,
    },
  });

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  return NextResponse.json(invoice);
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

  const updatedInvoice = await prisma.invoice.update({
    where: { id },
    data: {
      invoiceNumber: body.invoiceNumber,
      issueDate: new Date(body.issueDate),
      dueDate: new Date(body.dueDate),
      status: body.status,
      totalAmount: parseFloat(body.totalAmount),
      aiNarrative: body.aiNarrative || null,
    },
  });

  return NextResponse.json(updatedInvoice);
}
