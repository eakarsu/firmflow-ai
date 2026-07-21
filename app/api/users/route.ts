import { NextRequest } from 'next/server';
import { UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { apiActor, failure, response } from '@/lib/governance/http';
import { GovernanceError } from '@/lib/governance/policy';

export async function GET(request: NextRequest) {
  try {
    const actor = await apiActor();
    const role = new URL(request.url).searchParams.get('role');
    const valid = role && Object.values(UserRole).includes(role as UserRole) ? role as UserRole : undefined;
    if (actor.role !== UserRole.ADMIN && valid !== UserRole.LAWYER) {
      throw new GovernanceError(403, 'Only the active lawyer directory is available');
    }
    return response(await prisma.user.findMany({
      where: { active: true, ...(valid ? { role: valid } : {}) },
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: 'asc' },
    }));
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const actor = await apiActor();
    if (actor.role !== UserRole.ADMIN) throw new GovernanceError(403, 'Administrator required');
    const parsed = z.object({
      email: z.string().email().max(240),
      name: z.string().min(1).max(160),
      role: z.nativeEnum(UserRole),
      password: z.string().min(16).max(200),
    }).safeParse(await request.json());
    if (!parsed.success) throw new GovernanceError(400, 'Valid name, email, role, and a 16+ character password are required');
    const user = await prisma.user.create({
      data: {
        email: parsed.data.email.toLowerCase(),
        name: parsed.data.name,
        role: parsed.data.role,
        hashedPassword: await hash(parsed.data.password, 12),
      },
      select: { id: true, email: true, name: true, role: true, active: true },
    });
    return response(user, 201);
  } catch (error) {
    return failure(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const actor = await apiActor();
    if (actor.role !== UserRole.ADMIN) throw new GovernanceError(403, 'Administrator required');
    const id = new URL(request.url).searchParams.get('id');
    if (!id || id === actor.id) throw new GovernanceError(409, 'A valid different identity is required');
    const user = await prisma.user.update({
      where: { id },
      data: { active: false, tokenVersion: { increment: 1 } },
      select: { id: true, email: true, active: true },
    });
    return response(user);
  } catch (error) {
    return failure(error);
  }
}
