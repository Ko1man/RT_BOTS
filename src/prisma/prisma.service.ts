import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect(); // подключение к БД при старте Nest
  }

  async onModuleDestroy() {
    await this.$disconnect(); // закрыть соединение при завершении
  }
}
