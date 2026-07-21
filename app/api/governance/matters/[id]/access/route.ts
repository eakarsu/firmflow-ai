import { NextRequest } from 'next/server';import{apiActor,failure,response}from'@/lib/governance/http';import{grantAccess}from'@/lib/governance/service';
export async function POST(request:NextRequest,{params}:{params:Promise<{id:string}>}){try{return response(await grantAccess((await apiActor()).id,(await params).id,await request.json()),201)}catch(error){return failure(error)}}
