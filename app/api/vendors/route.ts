// app/api/vendors/route.ts
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return new Response('Unauthorized', { status: 401 });

    const user = await verifyJWT(token);
    if (!user) return new Response('Unauthorized', { status: 401 });

    const vendors = await prisma.vendor.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return Response.json(vendors);
  } catch (error) {
    console.error('[GET /api/vendors] Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}