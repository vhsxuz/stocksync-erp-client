// app/api/auth/login/route.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // 1. Find user
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return new Response('Invalid credentials', { status: 401 });
  }

  // 2. Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return new Response('Invalid credentials', { status: 401 });
  }

  // 3. Check verification
  if (!user.isVerified) {
    return new Response('Please verify your email first', { status: 403 });
  }

  // 4. Check active status
  if (!user.isActive) {
    return new Response('Your account is inactive. Contact support.', { status: 403 });
  }

  // 🎉 Auth success - you can create a session or JWT here
  return Response.json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
}