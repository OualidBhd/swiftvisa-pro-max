// scripts/test-prisma.ts
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { prisma } from '../lib/prisma';

async function main() {
  try {
    const applications = await prisma.application.findMany();
    console.log('✅ Fetched applications:', applications);
  } catch (error) {
    console.error('❌ Prisma error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();