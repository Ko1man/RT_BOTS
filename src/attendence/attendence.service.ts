import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAttendanceDto } from './dto/createAttendence.dto';
import { UpdateAttendanceDto } from './dto/updateAttendance.dto';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { GetAttendanceDto } from 'src/group/dto/get-info-attendance.dto';
import { ROLE } from '@prisma/client';

@Injectable()
export class AttendenceService {
    constructor(private readonly prisma: PrismaService) {}

    async checkAttendance(groupId: string, date: string) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const attendances = await this.prisma.attendance.findMany({
            where: {
                groupId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true,
                    },
                },
            },
        });

        // Группируем по занятиям
        return attendances;
    }

    async getAttendanceByLesson(groupId: string, lessonNumberId: string, date: string) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        return await this.prisma.attendance.findMany({
            where: {
                groupId,
                lessonNumberId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true,
                    },
                },
            },
        });
    }

    async createAttendance(dto: CreateAttendanceDto) {
        const { userIds, groupId, lessonNumberId, is_on_lesson } = dto;

        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        const group = await this.prisma.group.findUnique({
            where: { id: groupId },
        });

        if (!group) {
            throw new NotFoundException('группа не найдена');
        }

        const users = await this.prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true },
        });

        const existingUserIds = users.map((u) => u.id);
        if (existingUserIds.length !== userIds.length) {
            throw new BadRequestException('Некоторые userIds не существуют');
        }

        const exsistRows = await this.prisma.attendance.findMany({
            where: {
                lessonNumberId,
                groupId,
                createdAt: {
                    gte: startDate, // >= начало дня
                    lte: endDate,
                },
            },
        });

        return await this.prisma.attendance.createMany({
            data: userIds.map((userId, index) => ({
                userId,
                lessonNumberId,
                groupId,
                is_on_lesson: Array.isArray(is_on_lesson) ? is_on_lesson[index] : is_on_lesson,
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
        const { userIds, lessonNumberId, attendanceStatuses } = dto;

        if (userIds.length !== attendanceStatuses.length) {
            throw new BadRequestException(
                'Количество userIds и attendanceStatuses должно совпадать',
            );
        }

        const updates = userIds.map((userId, index) =>
            this.prisma.attendance.updateMany({
                where: {
                    groupId,
                    lessonNumberId,
                    userId,
                },
                data: {
                    is_on_lesson: attendanceStatuses[index],
                },
            }),
        );

        return await Promise.all(updates);
    }

    // Альтернативный метод для массового создания/обновления
    async upsertAttendance(groupId: string, dto: UpdateAttendanceDto) {
        const { userIds, lessonNumberId, attendanceStatuses } = dto;

        if (userIds.length !== attendanceStatuses.length) {
            throw new BadRequestException(
                'Количество userIds и attendanceStatuses должно совпадать',
            );
        }

        const operations = userIds.map((userId, index) =>
            this.prisma.attendance.upsert({
                where: {
                    userId_groupId_lessonNumberId: {
                        userId,
                        groupId,
                        lessonNumberId,
                    },
                },
                update: {
                    is_on_lesson: attendanceStatuses[index],
                },
                create: {
                    userId,
                    lessonNumberId,
                    groupId,
                    is_on_lesson: attendanceStatuses[index],
                },
            }),
        );

        return await Promise.all(operations);
    }

    async getAttendance(dto: GetAttendanceDto) {
        const { groupId, lessonNumberId, date } = dto;

        const where: any = { groupId };

        if (lessonNumberId) {
            where.lessonNumberId = lessonNumberId;
        }

        if (date) {
            const start = startOfDay(parseISO(date));
            const end = endOfDay(parseISO(date));
            where.createdAt = { gte: start, lte: end };
        }

        const attendances = await this.prisma.attendance.findMany({
            where,
            include: {
                user: { select: { id: true, fullName: true, name: true } },
                lessonNumber: { select: { id: true, lessonNumber: true, shift: true } },
            },
        });

        return attendances;
    }
}
