import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth';
import prisma from '../prisma';
import { GovernanceError } from './policy';

export async function apiActor(){const session=await getServerSession(authOptions);const id=session?.user?.id;if(!id)throw new GovernanceError(401,'Authentication required','unauthorized');const user=await prisma.user.findFirst({where:{id,active:true}});if(!user)throw new GovernanceError(401,'Session is inactive','unauthorized');return user}
export function safeJson(value:unknown):unknown{return JSON.parse(JSON.stringify(value,(_key,item)=>typeof item==='bigint'?item.toString():item))}
export function response(value:unknown,status=200){return NextResponse.json(safeJson(value),{status})}
export function failure(error:unknown){if(error instanceof GovernanceError)return NextResponse.json({error:error.message,code:error.code},{status:error.status});console.error('Governed document request failed',error instanceof Error?error.message:'unknown');return NextResponse.json({error:'Internal server error'},{status:500})}
