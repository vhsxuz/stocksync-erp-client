import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';

// ✅ GET single item
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return new NextResponse('Unauthorized', { status: 401 });

    const user = await verifyJWT(token);
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    const { id } = params;
    const item = await prisma.item.findUnique({
      where: { id },
      include: { vendor: true, category: true },
    });

    if (!item || item.userId !== user.id) {
      return new NextResponse('Item not found or unauthorized', { status: 404 });
    }

    return NextResponse.json({
      id: item.id,
      name: item.name,
      description: item.description,
      stock: item.stock,
      price: item.price,
      vendorName: item.vendor?.name ?? 'N/A',
      categoryName: item.category?.name ?? 'Uncategorized',
      createdAt: item.createdAt,
    });
  } catch (error) {
    console.error('[GET /api/items/[id]] Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// ✅ UPDATE item
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return new NextResponse('Unauthorized', { status: 401 });

    const user = await verifyJWT(token);
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    const { id } = params;
    const body = await req.json();
    const { name, description, price, stock, vendorId, categoryId } = body;

    const existingItem = await prisma.item.findUnique({ where: { id } });
    if (!existingItem || existingItem.userId !== user.id) {
      return new NextResponse('Item not found or unauthorized', { status: 404 });
    }

    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        name: name ?? existingItem.name,
        description: description ?? existingItem.description,
        price: price !== undefined ? Number(price) : existingItem.price,
        stock: stock !== undefined ? Number(stock) : existingItem.stock,
        vendorId: vendorId ?? existingItem.vendorId,
        categoryId: categoryId ?? existingItem.categoryId,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('[PUT /api/items/[id]] Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// ✅ DELETE item
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return new NextResponse('Unauthorized', { status: 401 });

    const user = await verifyJWT(token);
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    const { id } = params;
    const existingItem = await prisma.item.findUnique({ where: { id } });
    if (!existingItem || existingItem.userId !== user.id) {
      return new NextResponse('Item not found or unauthorized', { status: 404 });
    }

    await prisma.item.delete({ where: { id } });

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('[DELETE /api/items/[id]] Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
