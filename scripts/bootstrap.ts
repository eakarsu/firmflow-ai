import { hash } from 'bcryptjs';
import prisma from '../lib/prisma';

async function main(){const email=process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();const password=process.env.BOOTSTRAP_ADMIN_PASSWORD;const name=process.env.BOOTSTRAP_ADMIN_NAME?.trim();if(!email||!email.includes('@')||!name||!password||password.length<16)throw new Error('Set BOOTSTRAP_ADMIN_EMAIL, BOOTSTRAP_ADMIN_NAME, and a 16+ character BOOTSTRAP_ADMIN_PASSWORD');await prisma.user.upsert({where:{email},create:{email,name,hashedPassword:await hash(password,12),role:'ADMIN'},update:{name,hashedPassword:await hash(password,12),role:'ADMIN',active:true,tokenVersion:{increment:1}}});console.log('Runtime administrator provisioned')}
main().catch(error=>{console.error(error.message);process.exitCode=1}).finally(()=>prisma.$disconnect());
