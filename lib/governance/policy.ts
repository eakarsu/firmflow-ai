import { MatterAccessRole, Prisma, PrismaClient, UserRole } from '@prisma/client';

type Db = PrismaClient | Prisma.TransactionClient;
export class GovernanceError extends Error {
  constructor(public status: number, message: string, public code = 'invalid_request') { super(message); }
}

const rank: Record<MatterAccessRole, number> = { VIEWER: 1, EDITOR: 2, COUNSEL: 3, OWNER: 4 };

export async function activeActor(db: Db, actorId: string) {
  const actor = await db.user.findFirst({ where: { id: actorId, active: true } });
  if (!actor) throw new GovernanceError(401, 'Identity is inactive', 'identity_inactive');
  return actor;
}

export async function requireAccess(db: Db, actorId: string, caseId: string, minimum: MatterAccessRole, privileged = false) {
  const actor = await activeActor(db, actorId);
  if (actor.role === UserRole.ADMIN) return { actor, role: MatterAccessRole.OWNER, privilegedAccess: true };
  const matter = await db.case.findUnique({ where: { id: caseId }, select: { responsibleLawyerId: true } });
  if (!matter) throw new GovernanceError(404, 'Matter not found', 'not_found');
  if (matter.responsibleLawyerId === actorId) return { actor, role: MatterAccessRole.OWNER, privilegedAccess: true };
  const access = await db.caseAccess.findUnique({ where: { caseId_userId: { caseId, userId: actorId } } });
  if (!access || access.revokedAt || rank[access.role] < rank[minimum]) throw new GovernanceError(403, 'Matter access denied', 'matter_access_denied');
  if (privileged && !access.privilegedAccess) throw new GovernanceError(403, 'Privileged document access denied', 'privileged_access_denied');
  return { actor, role: access.role, privilegedAccess: access.privilegedAccess };
}

export function accessibleMatterWhere(actorId: string, role: UserRole): Prisma.CaseWhereInput {
  if (role === UserRole.ADMIN) return {};
  return { OR: [{ responsibleLawyerId: actorId }, { access: { some: { userId: actorId, revokedAt: null } } }] };
}

export function accessibleClientWhere(actorId: string, role: UserRole): Prisma.ClientWhereInput {
  if (role === UserRole.ADMIN) return {};
  return { OR: [{ createdById: actorId }, { cases: { some: accessibleMatterWhere(actorId, role) } }] };
}

export function requireProductionConfiguration() {
  if (process.env.NODE_ENV !== 'production') return;
  if (!process.env.DATABASE_URL || !process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET.length < 32) throw new Error('Production requires DATABASE_URL and a 32+ character NEXTAUTH_SECRET');
  const url = new URL(process.env.NEXTAUTH_URL || '');
  if (url.protocol !== 'https:') throw new Error('Production NEXTAUTH_URL must use HTTPS');
}
