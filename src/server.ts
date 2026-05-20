import app from './app/app';
import config from './config/env';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testConnection();

const main = async () => {
  app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`);
  });
};
main().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});
