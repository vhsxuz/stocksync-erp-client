// app/api/auth/verify-user/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';

export async function GET() {
  try {
    // 1️⃣ Get token from cookies
    const token = (await cookies()).get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    // 2️⃣ Verify and decode token
    const decoded = await verifyJWT(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // 3️⃣ Fetch user role from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // 4️⃣ Return user role
    return NextResponse.json({ role: user.role });
  } catch (error) {
    console.error('Error verifying user:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}