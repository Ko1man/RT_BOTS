import { Body, Controller, Get, Post } from '@nestjs/common';
import { LessonNumberService } from './lesson-number.service';
import { CreateLessonNumberDto } from './dto/createLessonNumber.dto';

@Controller('lesson-number')
export class LessonNumberController {
    constructor(private readonly lessonNumberService: LessonNumberService) {}

    @Get('all')
    async getAllLessonNumbers() {
        return this.lessonNumberService.getAllLessonNumbers();
    }

    @Post('crate-lesson-number')
    async cratelessonNumber(@Body() dto: CreateLessonNumberDto) {
        return await this.lessonNumberService.createLessonNumber(dto);
    }
}
