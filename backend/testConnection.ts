import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection(): Promise<void> {
  try {
    console.log('Connecting');
    await prisma.$connect();
    console.log('✅ Successfully connected to MongoDB!');
    const count = await prisma.product.count();
    console.log(`Product count: ${count}`);
  } catch (error) {
    const err = error as Error;
    console.error('❌ Connection failed:', err.message);
    console.error('Full error:', err);
  } finally {
    await prisma.$disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

void testConnection();
