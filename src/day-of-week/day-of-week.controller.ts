import { Controller } from '@nestjs/common';
import { DayOfWeekService } from './day-of-week.service';

@Controller('day-of-week')
export class DayOfWeekController {
  constructor(private readonly dayOfWeekService: DayOfWeekService) {}
}
