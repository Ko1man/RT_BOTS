import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAttendanceDto } from './dto/createAttendence.dto';
import { UpdateAttendanceDto } from './dto/updateAttendance.dto';

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

        const users = await this.prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true },
        });

        const existingUserIds = users.map((u) => u.id);
        if (existingUserIds.length !== userIds.length) {
            throw new BadRequestException('Некоторые userIds не существуют');
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

    async delete(ids: string[]) {
        return await this.prisma.attendance.deleteMany({
            where: {
                id: { in: ids },
            },
        });
    }

    async updateAttendance(groupId: string, dto: UpdateAttendanceDto) {
        const { userIds, lessonNumberId, is_on_lesson } = dto;

        const attendances = await this.prisma.attendance.findMany({
            where: {
                groupId,
                lessonNumberId,
                userId: { in: userIds },
            },
        });

        if (!attendances.length) {
            throw new NotFoundException('Записи посещаемости не найдены');
        }

        const update = await this.prisma.attendance.updateMany({
            where: {
                groupId,
                lessonNumberId,
                userId: { in: userIds },
            },
            data: {
                is_on_lesson,
            },
        });

        return update;
    }
}
