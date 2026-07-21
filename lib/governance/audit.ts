import crypto from 'node:crypto';
import { Prisma, PrismaClient } from '@prisma/client';
type Db = PrismaClient | Prisma.TransactionClient;

export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value as object).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson((value as Record<string,unknown>)[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
export const sha256 = (value: string) => crypto.createHash('sha256').update(value).digest('hex');

export async function appendAudit(db: Db, input: { caseId:string;documentId?:string|null;actorId?:string|null;action:string;details:unknown }) {
  await db.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${input.caseId}))`;
  const prior = await db.governanceAuditEvent.findFirst({ where:{caseId:input.caseId},orderBy:{sequence:'desc'} });
  const sequence = (prior?.sequence || BigInt(0)) + BigInt(1);
  const previousHash = prior?.eventHash || '0'.repeat(64);
  const createdAt = new Date();
  const details = input.details as Prisma.InputJsonValue;
  const eventHash = sha256([previousHash,input.caseId,sequence.toString(),input.documentId||'',input.actorId||'',input.action,canonicalJson(details),createdAt.toISOString()].join('|'));
  return db.governanceAuditEvent.create({data:{sequence,caseId:input.caseId,documentId:input.documentId||null,actorId:input.actorId||null,action:input.action,details,previousHash,eventHash,createdAt}});
}

export async function verifyAudit(db: Db, caseId:string) {
  const events=await db.governanceAuditEvent.findMany({where:{caseId},orderBy:{sequence:'asc'}});let previous='0'.repeat(64);
  for(const event of events){const expected=sha256([previous,caseId,event.sequence.toString(),event.documentId||'',event.actorId||'',event.action,canonicalJson(event.details),event.createdAt.toISOString()].join('|'));if(event.previousHash!==previous||event.eventHash!==expected)return false;previous=event.eventHash;}return true;
}
