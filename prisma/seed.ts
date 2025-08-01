// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: hashed,
      name: 'Seeded User',
      isVerified: true,
      isActive: true,
    },
  });

  const vendor = await prisma.vendor.create({
    data: {
      name: 'Test Vendor',
      userId: user.id,
    },
  });

  const item = await prisma.item.create({
    data: {
      name: 'Seeded Item',
      price: 50,
      stock: 20,
      userId: user.id,
    },
  });

  await prisma.transactionHeader.create({
    data: {
      userId: user.id,
      vendorId: vendor.id,
      totalAmount: 1000,
      details: {
        create: {
          itemId: item.id,
          quantity: 20,
          priceAtPurchase: 50,
        },
      },
    },
  });

  console.log('🌱 Seed complete');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());