import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonDto } from './dto/createLesson.dto';

@Injectable()
export class LessonService {
    constructor(private readonly prisma: PrismaService) {}

    async createLesson(dto: CreateLessonDto) {
        const { number, shift } = dto;
        const lesson = await this.prisma.lessonNumber.create({
            data: {
                number,
                shift,
            },
        });

        return lesson;
    }

    async getAll(){
        return await this.prisma.lessonNumber.findMany()
    }
}
