import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Seed roles
  await prisma.role.createMany({
    data: [
      { name: 'ADMIN' },
      { name: 'USER' },
    ],
    skipDuplicates: true,
  });

  const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  const userRole = await prisma.role.findUnique({ where: { name: 'USER' } });

  if (!adminRole || !userRole) throw new Error('Roles not found.');

  const users = [];
  for (let i = 0; i < 5; i++) {
    const password = await bcrypt.hash('password123', 10);
    users.push(
      await prisma.user.create({
        data: {
          email: `user${i}@example.com`,
          password,
          name: faker.person.fullName(),
          isVerified: true,
          isActive: true,
          subscriptionExpiry: faker.date.soon({ days: 30 }),
          roleId: i === 0 ? adminRole.id : userRole.id,
        },
      })
    );
  }

  const vendors = [];
  for (let i = 0; i < 5; i++) {
    vendors.push(
      await prisma.vendor.create({
        data: {
          name: faker.company.name(),
          contact: faker.phone.number(),
          address: faker.location.streetAddress(),
          userId: users[i % users.length].id,
        },
      })
    );
  }

  const items = [];
  for (let i = 0; i < 5; i++) {
    items.push(
      await prisma.item.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: parseFloat(faker.commerce.price({ min: 10, max: 100 })),
          stock: faker.number.int({ min: 10, max: 100 }),
          userId: users[i % users.length].id,
          vendorId: vendors[i % vendors.length].id,
        },
      })
    );
  }

  for (let i = 0; i < 5; i++) {
    await prisma.transactionHeader.create({
      data: {
        userId: users[i % users.length].id,
        totalAmount: 0,
        details: {
          create: [
            {
              itemId: items[i % items.length].id,
              quantity: 1 + i,
              priceAtPurchase: items[i % items.length].price,
            },
          ],
        },
      },
    });
  }

  for (let i = 0; i < 5; i++) {
    await prisma.supplyTransactionHeader.create({
      data: {
        userId: users[i % users.length].id,
        vendorId: vendors[i % vendors.length].id,
        totalAmount: 0,
        details: {
          create: [
            {
              itemId: items[i % items.length].id,
              quantity: 5 + i,
              priceAtPurchase: items[i % items.length].price,
            },
          ],
        },
      },
    });
  }

  console.log('🌱 Database has been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());