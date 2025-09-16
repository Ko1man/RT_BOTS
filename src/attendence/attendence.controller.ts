import { Controller } from '@nestjs/common';
import { AttendenceService } from './attendence.service';

@Controller('attendence')
export class AttendenceController {
  constructor(private readonly attendenceService: AttendenceService) {}
}
