import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return new Response('Unauthorized', { status: 401 });

    const user = await verifyJWT(token);
    if (!user?.id) return new Response('Unauthorized', { status: 401 });

    // Total revenue from transactions
    const revenueAgg = await prisma.transactionHeader.aggregate({
      where: { userId: user.id },
      _sum: { totalAmount: true },
    });

    // Latest 3 transactions
    const latestTransactions = await prisma.transactionHeader.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: { id: true, totalAmount: true, createdAt: true },
    });

    // Low stock items (stock < 5)
    const lowStockItems = await prisma.item.findMany({
      where: { userId: user.id, stock: { lt: 5 } },
      select: { id: true, name: true, stock: true },
      orderBy: { stock: 'asc' },
      take: 5,
    });

    return Response.json({
      totalRevenue: revenueAgg._sum.totalAmount || 0,
      latestTransactions,
      lowStockItems,
    });
  } catch (error) {
    console.error('[GET /api/dashboard/summary] Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}