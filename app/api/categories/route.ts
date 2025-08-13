import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyJWT } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    // Verify user
    const token = req.cookies.get('token')?.value
    if (!token) {
      return new Response('Unauthorized', { status: 401 })
    }

    const user = await verifyJWT(token)
    if (!user?.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Ensure Prisma is initialized
    if (!prisma) {
      console.error('Prisma client failed to initialize')
      return new Response('Internal Server Error', { status: 500 })
    }

    // Fetch categories
    const userCategories = await prisma.userItemCategory.findMany({
      where: { userId: user.id },
      include: { category: true },
      orderBy: { category: { name: 'asc' } },
    })

    const categories = userCategories.map((uc) => ({
      id: uc.category.id,
      name: uc.category.name,
    }))

    return Response.json(categories)
  } catch (error) {
    console.error('[GET /api/categories] Error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return new Response('Unauthorized', { status: 401 });

    const user = await verifyJWT(token);
    if (!user?.id) return new Response('Unauthorized', { status: 401 });

    const { name } = await req.json();
    if (!name || typeof name !== 'string') {
      return new Response('Invalid category name', { status: 400 });
    }

    // 1️⃣ Try to find existing category with the same name
    let category = await prisma.itemCategory.findFirst({
      where: { name },
    });

    // 2️⃣ If not found, create it
    if (!category) {
      category = await prisma.itemCategory.create({
        data: { name },
      });
    }

    // 3️⃣ Link to the user if not already linked
    await prisma.userItemCategory.upsert({
      where: {
        userId_categoryId: {
          userId: user.id,
          categoryId: category.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        categoryId: category.id,
      },
    });

    return Response.json(category, { status: 201 });
  } catch (error) {
    console.error('[POST /api/categories] Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}