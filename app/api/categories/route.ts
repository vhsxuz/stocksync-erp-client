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