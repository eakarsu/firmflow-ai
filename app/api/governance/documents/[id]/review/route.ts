import { NextRequest } from 'next/server';import{apiActor,failure,response}from'@/lib/governance/http';import{reviewDocument}from'@/lib/governance/service';
export async function POST(request:NextRequest,{params}:{params:Promise<{id:string}>}){try{return response(await reviewDocument((await apiActor()).id,(await params).id,await request.json()),201)}catch(error){return failure(error)}}
