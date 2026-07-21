import { NextRequest } from 'next/server';
import { apiActor,failure,response } from '@/lib/governance/http';
import { createDocument,listDocuments } from '@/lib/governance/service';
export async function GET(){try{return response(await listDocuments((await apiActor()).id))}catch(error){return failure(error)}}
export async function POST(request:NextRequest){try{return response(await createDocument((await apiActor()).id,await request.json()),201)}catch(error){return failure(error)}}
