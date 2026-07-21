import{NextResponse}from'next/server';export async function POST(){return NextResponse.json({error:'Ungoverned intake generation is retired'},{status:410})}
