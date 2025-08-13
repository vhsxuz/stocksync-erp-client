import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const category = searchParams.get('category'); // Changed to 'category' to match frontend

    const token = req.cookies.get('token')?.value;
    if (!token) return new Response('Unauthorized', { status: 401 });

    const user = await verifyJWT(token);
    if (!user) return new Response('Unauthorized', { status: 401 });

    const whereClause: Prisma.ItemWhereInput = {
      userId: user.id,
      name: {
        contains: search,
        mode: Prisma.QueryMode.insensitive,
      },
      ...(category && category !== 'undefined' ? { categoryId: category } : {}), // Fixed parameter name
    };

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        include: { 
          vendor: true,
          category: true, // Include category details
        },
      }),
      prisma.item.count({ where: whereClause }),
    ]);

    const itemsWithVendor = items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      stock: item.stock,
      price: item.price,
      vendorName: item.vendor?.name ?? 'N/A',
      categoryName: item.category?.name ?? 'Uncategorized', // Added category name
      createdAt: item.createdAt,
    }));

    return Response.json({
      items: itemsWithVendor,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[GET /api/items] Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return new Response('Unauthorized', { status: 401 });

    const user = await verifyJWT(token);
    if (!user) return new Response('Unauthorized', { status: 401 });

    const body = await req.json();
    const { name, description, price, stock, vendorId, categoryId } = body;

    if (!name || !price || !stock || !vendorId) {
      return new Response('Missing required fields', { status: 400 });
    }

    const newItem = await prisma.item.create({
      data: {
        name,
        description: description || null,
        price: Number(price),
        stock: Number(stock),
        vendorId,
        categoryId: categoryId || null,
        userId: user.id,
      },
    });

    return Response.json(newItem, { status: 201 });
  } catch (error) {
    console.error('[POST /api/items] Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}