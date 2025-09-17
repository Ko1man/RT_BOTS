import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAttendanceDto } from './dto/createAttendence.dto';

@Injectable()
export class AttendenceService {
    constructor(private readonly prisma: PrismaService) {}

    async createAttendance(dto: CreateAttendanceDto) {
        const { userIds, groupId, lessonNumberId, is_on_lesson } = dto;

        const group = await this.prisma.group.findUnique({
            where: { id: groupId },
        });

        if (!group) {
            throw new NotFoundException('группа не найдена');
        }

        const lessonNumber = await this.prisma.lessonNumber.findUnique({
            where: { id: lessonNumberId },
        });

        if (!lessonNumber) {
            throw new NotFoundException('Занятие не найденно');
        }

        return await this.prisma.attendance.createMany({
            data: userIds.map((userId) => ({
                userId,
                lessonNumberId,
                groupId,
                is_on_lesson,
            })),
            skipDuplicates: true,
        });
    }

    async delete(ids: string[]){
        return await this.prisma.attendance.deleteMany({
            where : {
                id: {in: ids}
            }
        })
    }
}
