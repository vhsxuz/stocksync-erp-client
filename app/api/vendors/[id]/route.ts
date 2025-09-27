// app/api/items/[id]/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getPrisma } from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';

async function getUserFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  try {
    return await verifyJWT(token);
  } catch {
    return null;
  }
}

// ✅ GET /api/items/[id]
export async function GET(
  _req: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: any
) {
  try {
    const user = await getUserFromCookie();
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    const id = String(params?.id);
    const prisma = getPrisma();
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

// ✅ PUT /api/items/[id]
export async function PUT(
  req: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: any
) {
  try {
    const user = await getUserFromCookie();
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    const id = String(params?.id);
    const { name, description, price, stock, vendorId, categoryId } = await req.json();

    const prisma = getPrisma();
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

// ✅ DELETE /api/items/[id]
export async function DELETE(
  _req: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: any
) {
  try {
    const user = await getUserFromCookie();
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    const id = String(params?.id);

    const prisma = getPrisma();
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
