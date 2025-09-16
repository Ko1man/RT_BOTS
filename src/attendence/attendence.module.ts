import { Module } from '@nestjs/common';
import { AttendenceService } from './attendence.service';
import { AttendenceController } from './attendence.controller';

@Module({
  controllers: [AttendenceController],
  providers: [AttendenceService],
})
export class AttendenceModule {}
