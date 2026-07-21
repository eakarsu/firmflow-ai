import { NextRequest } from 'next/server';import{apiActor,failure,response}from'@/lib/governance/http';import{auditStatus}from'@/lib/governance/service';
export async function GET(_request:NextRequest,{params}:{params:Promise<{id:string}>}){try{return response(await auditStatus((await apiActor()).id,(await params).id))}catch(error){return failure(error)}}
