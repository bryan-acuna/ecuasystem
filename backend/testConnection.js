import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Connecting');
    await prisma.$connect();
    console.log('✅ Successfully connected to MongoDB!');
    const count = await prisma.product.count();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}
testConnection();
