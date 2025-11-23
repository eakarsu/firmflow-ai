import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const documents = await prisma.document.findMany({
    include: {
      case: {
        include: {
          client: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json(documents);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const newDocument = await prisma.document.create({
    data: {
      title: body.title,
      docType: body.docType,
      caseId: body.caseId,
      content: body.content || null,
      storagePath: body.storagePath || body.filePath || null,
      aiSummary: body.aiSummary || null,
    },
  });

  return NextResponse.json(newDocument, { status: 201 });
}
