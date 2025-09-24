import { Module } from '@nestjs/common';
import { DayOfWeekService } from './day-of-week.service';
import { DayOfWeekController } from './day-of-week.controller';

@Module({
  controllers: [DayOfWeekController],
  providers: [DayOfWeekService],
})
export class DayOfWeekModule {}
