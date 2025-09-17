import { Body, Controller, Get, Post } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/createLesson.dto';

@Controller('lessonsNumber')
export class LessonController {
    constructor(private readonly lessonService: LessonService) {}

    @Post('create')
    async createLesson(@Body() dto: CreateLessonDto) {
        return await this.lessonService.createLesson(dto);
    }

    @Get()
    async getAll() {
        return this.lessonService.getAll();
    }
}
