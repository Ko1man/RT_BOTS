import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAttendanceDto } from './dto/createAttendence.dto';

@Injectable()
export class AttendenceService {
    constructor(private readonly prisma: PrismaService){}

    async createAttendance(dto: CreateAttendanceDto){
        const {userIds, groupId, lessonNumberId} = dto

        const group = await this.prisma.group.findUnique({
            where: {id: groupId}
        })

        if(!group){
            throw new NotFoundException('группа не найдена')
        }

        const lessonNumber = await this.prisma.lessonNumber.findUnique({
            where : {id: lessonNumberId}
        })

        if(!lessonNumber){
            throw new NotFoundException('Занятие не найденно')
        }
    }
}
