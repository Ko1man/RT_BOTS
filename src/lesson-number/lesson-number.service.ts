import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonNumberDto } from './dto/createLessonNumber.dto';

@Injectable()
export class LessonNumberService {
    constructor(private readonly prisma: PrismaService){}

    async createLessonNumber(dto: CreateLessonNumberDto){
        const {lessonNumber, shift} = dto;
        const lessonNum = await this.prisma.lessonNumber.create({
            data: {
                lessonNumber,
                shift
            }
        })
        return lessonNum
    }

    async getAllLessonNumbers(){
        return await this.prisma.lessonNumber.findMany({
            include: {
                Attendance: true
            }
        })
    }
}
