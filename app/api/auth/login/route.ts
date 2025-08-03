// app/api/auth/login/route.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return new Response('Invalid credentials', { status: 401 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return new Response('Invalid credentials', { status: 401 });

    if (!user.isVerified) {
      return new Response('Please verify your email first', { status: 403 });
    }

    if (!user.isActive) {
      return new Response('Your account is inactive. Contact support.', { status: 403 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return new Response(JSON.stringify({ message: 'Login successful' }), {
      status: 200,
      headers: {
        'Set-Cookie': cookie,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}