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

  // Seed users
  const users = [];
  for (let i = 0; i < 5; i++) {
    const password = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        password,
        name: faker.person.fullName(),
        isVerified: true,
        isActive: true,
        subscriptionExpiry: faker.date.soon({ days: 30 }),
        roleId: i === 0 ? adminRole.id : userRole.id,
      },
    });
    users.push(user);
  }

  // Seed item categories (shared pool)
  const categoryNames = ['Electronics', 'Clothing', 'Office Supplies', 'Furniture', 'Toys', 'Groceries'];
  const categories = await Promise.all(
    categoryNames.map((name) => prisma.itemCategory.create({ data: { name } }))
  );

  // Connect users to random categories (UserItemCategory)
  for (const user of users) {
    const userCategories = faker.helpers.arrayElements(categories, 3);
    for (const category of userCategories) {
      await prisma.userItemCategory.create({
        data: {
          userId: user.id,
          categoryId: category.id,
        },
      });
    }
  }

  // Seed vendors
  const vendors = [];
  for (let i = 0; i < 10; i++) {
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

  // Seed items (15 per user)
  const items = [];
  for (const user of users) {
    const userCategoryLinks = await prisma.userItemCategory.findMany({ where: { userId: user.id } });
    const userCategories = userCategoryLinks.map((uc) => uc.categoryId);

    for (let i = 0; i < 15; i++) {
      const categoryId = faker.helpers.arrayElement(userCategories);
      const vendor = vendors[Math.floor(Math.random() * vendors.length)];

      items.push(
        await prisma.item.create({
          data: {
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: parseFloat(faker.commerce.price({ min: 10, max: 100 })),
            stock: faker.number.int({ min: 10, max: 100 }),
            userId: user.id,
            vendorId: vendor.id,
            categoryId,
          },
        })
      );
    }
  }

  // Seed transactions
  for (let i = 0; i < 10; i++) {
    const item = faker.helpers.arrayElement(items);
    const user = users.find((u) => u.id === item.userId)!;

    await prisma.transactionHeader.create({
      data: {
        userId: user.id,
        totalAmount: item.price * 2,
        details: {
          create: [
            {
              itemId: item.id,
              quantity: 2,
              priceAtPurchase: item.price,
            },
          ],
        },
      },
    });
  }

  // Seed supply transactions
  for (let i = 0; i < 10; i++) {
    const item = faker.helpers.arrayElement(items);
    const vendor = vendors.find((v) => v.id === item.vendorId)!;

    await prisma.supplyTransactionHeader.create({
      data: {
        userId: vendor.userId,
        vendorId: vendor.id,
        totalAmount: item.price * 5,
        details: {
          create: [
            {
              itemId: item.id,
              quantity: 5,
              priceAtPurchase: item.price,
            },
          ],
        },
      },
    });
  }

  console.log('🌱 Database has been seeded with users, vendors, items, categories, and transactions!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());