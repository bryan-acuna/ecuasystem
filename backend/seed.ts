import { PrismaClient } from '@prisma/client';
import products from './data/products.js';
import users from './data/user.js';

const prisma = new PrismaClient();

const seedProducts = async (): Promise<void> => {
  try {
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@email.com' },
    });
    if (!adminUser) throw new Error('Admin user not found — seed users first');

    console.error('Seed starting');
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.review.deleteMany();
    console.error('Delete existing product');

    for (const product of products) {
      await prisma.product.create({
        data: {
          name: product.name,
          image: product.image,
          description: product.description,
          brand: product.brand,
          category: product.category,
          price: product.price,
          countInStock: product.countInStock,
          rating: product.rating,
          numReviews: product.numReviews,
          userId: adminUser.id,
        },
      });
      console.error('Product created');
    }
    const p = await prisma.product.findMany();
    console.log(p);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
    console.error('Disconnected');
  }
};

// Kept for manual invocation; swap the call below to seedUsers() to run.
const _seedUsers = async (): Promise<void> => {
  try {
    console.error('Seed starting');
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.review.deleteMany();
    console.error('Delete existing product');
    for (const user of users) {
      await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: user.password,
          isAdmin: user.isAdmin ?? false,
        },
      });
      console.error('User created');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
    console.error('Disconnected');
  }
};

void _seedUsers;
void seedProducts();
