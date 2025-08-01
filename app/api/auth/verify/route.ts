// app/api/auth/verify/route.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get('email');
  if (!email) return new Response('Invalid request', { status: 400 });

  const user = await prisma.user.update({
    where: { email },
    data: { isVerified: true },
  });

  return Response.json({ 
    message: 'Account verified!',
    user: user
  });
}
