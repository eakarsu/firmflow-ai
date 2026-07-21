import { NextRequest } from 'next/server';import{apiActor,failure,response}from'@/lib/governance/http';import{updateRetention}from'@/lib/governance/service';
export async function PUT(request:NextRequest,{params}:{params:Promise<{id:string}>}){try{return response(await updateRetention((await apiActor()).id,(await params).id,await request.json()))}catch(error){return failure(error)}}
