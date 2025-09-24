import { Module } from '@nestjs/common';
import { LessonNumberService } from './lesson-number.service';
import { LessonNumberController } from './lesson-number.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [LessonNumberController],
  providers: [LessonNumberService, PrismaService],
})
export class LessonNumberModule {}
