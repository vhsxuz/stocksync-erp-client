// app/api/vendors/[id]/route.ts
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return new Response('Unauthorized', { status: 401 });

    const user = await verifyJWT(token);
    if (!user) return new Response('Unauthorized', { status: 401 });

    const vendor = await prisma.vendor.findFirst({
      where: { id: params.id, userId: user.id },
    });
    if (!vendor) return new Response('Not Found', { status: 404 });

    return Response.json(vendor);
  } catch (error) {
    console.error('[GET /api/vendors/:id] Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return new Response('Unauthorized', { status: 401 });

    const user = await verifyJWT(token);
    if (!user) return new Response('Unauthorized', { status: 401 });

    const vendorId = params.id;
    const { name, contact, address } = await req.json();

    const existing = await prisma.vendor.findFirst({
      where: { id: vendorId, userId: user.id },
    });
    if (!existing) return new Response('Not Found', { status: 404 });

    const updated = await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(contact !== undefined ? { contact } : {}),
        ...(address !== undefined ? { address } : {}),
      },
    });

    return Response.json(updated);
  } catch (error) {
    console.error('[PATCH /api/vendors/:id] Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return new Response('Unauthorized', { status: 401 });

    const user = await verifyJWT(token);
    if (!user) return new Response('Unauthorized', { status: 401 });

    const vendorId = params.id;

    const existing = await prisma.vendor.findFirst({
      where: { id: vendorId, userId: user.id },
    });
    if (!existing) return new Response('Not Found', { status: 404 });

    await prisma.vendor.delete({ where: { id: vendorId } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('[DELETE /api/vendors/:id] Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}


