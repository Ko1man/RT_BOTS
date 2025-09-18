import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAttendanceDto } from './dto/createAttendence.dto';
import { UpdateAttendanceDto } from './dto/updateAttendance.dto';

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
                    lte: endDate
                }
            },
            include: {
                lessonNumber: true,
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                lessonNumber: {
                    number: 'asc'
                }
            }
        });

        // Группируем по занятиям
        const groupedByLesson = {};
        attendances.forEach(att => {
            if (!groupedByLesson[att.lessonNumberId]) {
                groupedByLesson[att.lessonNumberId] = {
                    lessonNumber: att.lessonNumber,
                    attendances: []
                };
            }
            groupedByLesson[att.lessonNumberId].attendances.push(att);
        });

        return {
            hasData: attendances.length > 0,
            attendances: groupedByLesson
        };
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
                    lte: endDate
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true
                    }
                }
            }
        });
    }

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
        const { userIds, lessonNumberId, attendanceStatuses } = dto;

        if (userIds.length !== attendanceStatuses.length) {
            throw new BadRequestException('Количество userIds и attendanceStatuses должно совпадать');
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
            })
        );

        return await Promise.all(updates);
    }

    // Альтернативный метод для массового создания/обновления
    async upsertAttendance(groupId: string, dto: UpdateAttendanceDto) {
        const { userIds, lessonNumberId, attendanceStatuses } = dto;

        if (userIds.length !== attendanceStatuses.length) {
            throw new BadRequestException('Количество userIds и attendanceStatuses должно совпадать');
        }

        const operations = userIds.map((userId, index) => 
            this.prisma.attendance.upsert({
                where: {
                    userId_lessonNumberId_groupId: {
                        userId,
                        lessonNumberId,
                        groupId,
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
            })
        );

        return await Promise.all(operations);
    }
}