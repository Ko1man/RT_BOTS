import { Module } from '@nestjs/common';
import { AttendenceService } from './attendence.service';
import { AttendenceController } from './attendence.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AttendenceController],
  providers: [AttendenceService, PrismaService],
})
export class AttendenceModule {}
