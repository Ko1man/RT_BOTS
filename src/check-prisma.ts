import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Модели PrismaClient:');
    const models = Object.keys(prisma).filter((key) => typeof (prisma as any)[key] === 'object');
    console.log(models);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
