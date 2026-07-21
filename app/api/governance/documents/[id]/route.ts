import { NextRequest } from 'next/server';
import { apiActor,failure,response } from '@/lib/governance/http';
import { addVersion,documentDetail,purgeDocument } from '@/lib/governance/service';
type Context={params:Promise<{id:string}>};
export async function GET(_request:NextRequest,{params}:Context){try{return response(await documentDetail((await apiActor()).id,(await params).id))}catch(error){return failure(error)}}
export async function POST(request:NextRequest,{params}:Context){try{return response(await addVersion((await apiActor()).id,(await params).id,await request.json()),201)}catch(error){return failure(error)}}
export async function DELETE(_request:NextRequest,{params}:Context){try{return response(await purgeDocument((await apiActor()).id,(await params).id))}catch(error){return failure(error)}}
