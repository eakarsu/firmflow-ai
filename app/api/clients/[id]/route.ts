import { NextRequest } from 'next/server';
import { UserRole } from '@prisma/client';
import prisma from '@/lib/prisma';
import { apiActor, failure, response } from '@/lib/governance/http';
import { accessibleClientWhere, accessibleMatterWhere, GovernanceError } from '@/lib/governance/policy';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await apiActor();
    const { id } = await params;
    const cases = accessibleMatterWhere(actor.id, actor.role);
    const client = await prisma.client.findFirst({
      where: { id, ...accessibleClientWhere(actor.id, actor.role) },
      include: {
        cases: {
          where: cases,
          include: { responsibleLawyer: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: 'desc' },
        },
        intakeForms: actor.role === UserRole.ADMIN ? { orderBy: { createdAt: 'desc' } } : false,
      },
    });
    if (!client) throw new GovernanceError(404, 'Client not found');
    return response(client);
  } catch (error) {
    return failure(error);
  }
}
