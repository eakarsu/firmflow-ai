import { NextRequest } from 'next/server';import{apiActor,failure,response}from'@/lib/governance/http';import{syncTemplate}from'@/lib/governance/service';
export async function POST(request:NextRequest){try{return response(await syncTemplate((await apiActor()).id,await request.json()),201)}catch(error){return failure(error)}}
