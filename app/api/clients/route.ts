import { NextRequest } from 'next/server';
import { UserRole } from '@prisma/client';
import prisma from '@/lib/prisma';
import { apiActor, failure, response } from '@/lib/governance/http';
import { accessibleClientWhere, GovernanceError } from '@/lib/governance/policy';

export async function GET() {
  try {
    const actor = await apiActor();
    return response(await prisma.client.findMany({
      where: accessibleClientWhere(actor.id, actor.role),
      orderBy: { createdAt: 'desc' },
    }));
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const actor = await apiActor();
    if (actor.role !== UserRole.ADMIN && actor.role !== UserRole.LAWYER) {
      throw new GovernanceError(403, 'Lawyer or administrator required');
    }
    const body = await request.json();
    return response(await prisma.client.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        address: body.address || null,
        companyName: body.companyName || null,
        notes: body.notes || null,
        createdById: actor.id,
      },
    }), 201);
  } catch (error) {
    return failure(error);
  }
}
