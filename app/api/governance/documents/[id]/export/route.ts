import { NextRequest } from 'next/server';import{apiActor,failure,response}from'@/lib/governance/http';import{exportEvidence}from'@/lib/governance/service';
export async function POST(_request:NextRequest,{params}:{params:Promise<{id:string}>}){try{return response(await exportEvidence((await apiActor()).id,(await params).id),201)}catch(error){return failure(error)}}
