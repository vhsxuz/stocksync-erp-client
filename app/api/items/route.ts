import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url!);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '5', 10);

  const [items, total] = await Promise.all([
    prisma.item.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        vendor: true,
      },
    }),
    prisma.item.count(),
  ]);

  const itemsWithVendor = items.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    stock: item.stock,
    price: item.price,
    vendorName: item.vendor?.name ?? 'N/A',
    createdAt: item.createdAt,
  }));

  return Response.json({
    items: itemsWithVendor,
    totalPages: Math.ceil(total / limit),
  });
}
