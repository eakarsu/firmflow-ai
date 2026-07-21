import { NextRequest } from 'next/server';
import { UserRole } from '@prisma/client';
import prisma from '@/lib/prisma';
import { apiActor, failure, response } from '@/lib/governance/http';
import { accessibleClientWhere, accessibleMatterWhere, GovernanceError } from '@/lib/governance/policy';

export async function GET() {
  try {
    const actor = await apiActor();
    return response(await prisma.case.findMany({
      where: accessibleMatterWhere(actor.id, actor.role),
      include: { client: true, responsibleLawyer: { select: { id: true, name: true, email: true, role: true } } },
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
    const result = await prisma.$transaction(async (tx) => {
      const client = await tx.client.findFirst({
        where: { id: body.clientId, ...accessibleClientWhere(actor.id, actor.role) },
      });
      if (!client) throw new GovernanceError(404, 'Client not found');

      const responsibleLawyerId = body.responsibleLawyerId || actor.id;
      const responsible = await tx.user.findFirst({
        where: { id: responsibleLawyerId, role: UserRole.LAWYER, active: true },
      });
      if (!responsible) throw new GovernanceError(400, 'Responsible lawyer is inactive or invalid');

      const matter = await tx.case.create({
        data: {
          title: body.title,
          description: body.description,
          clientId: client.id,
          responsibleLawyerId,
          status: body.status || 'OPEN',
          practiceArea: body.practiceArea,
          courtName: body.courtName || null,
          courtFileNumber: body.courtFileNumber || null,
        },
      });
      await tx.caseAccess.createMany({
        data: [
          { caseId: matter.id, userId: actor.id, role: 'OWNER', privilegedAccess: true },
          { caseId: matter.id, userId: matter.responsibleLawyerId, role: 'COUNSEL', privilegedAccess: true },
        ],
        skipDuplicates: true,
      });
      return matter;
    });
    return response(result, 201);
  } catch (error) {
    return failure(error);
  }
}
