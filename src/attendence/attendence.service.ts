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
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true
                    }
                }
            },
        });

        // Группируем по занятиям
        return attendances
    }

    async getAttendanceByLesson(groupId: string, lessonNumber: number, date: string) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        return await this.prisma.attendance.findMany({
            where: {
                groupId,
                lessonNumber,
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
        const { userIds, groupId, lessonNumber, is_on_lesson } = dto;

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
            where : {
                lessonNumber,
                groupId,
                createdAt: {
                    gte: startDate, // >= начало дня
                    lte: endDate,
                }
            }
        })
        if(exsistRows.length > 0){
            throw new BadRequestException('Запись для этой группы уже существует')
        }

        return await this.prisma.attendance.createMany({
            data: userIds.map((userId) => ({
                userId,
                lessonNumber,
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
        const { userIds, lessonNumber, attendanceStatuses } = dto;

        if (userIds.length !== attendanceStatuses.length) {
            throw new BadRequestException('Количество userIds и attendanceStatuses должно совпадать');
        }

        const updates = userIds.map((userId, index) => 
            this.prisma.attendance.updateMany({
                where: {
                    groupId,
                    lessonNumber,
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
        const { userIds, lessonNumber, attendanceStatuses } = dto;

        if (userIds.length !== attendanceStatuses.length) {
            throw new BadRequestException('Количество userIds и attendanceStatuses должно совпадать');
        }

        const operations = userIds.map((userId, index) => 
            this.prisma.attendance.upsert({
                where: {
                    userId_groupId: {
                        userId,
                        groupId,
                    },
                },
                update: {
                    is_on_lesson: attendanceStatuses[index],
                },
                create: {
                    userId,
                    lessonNumber,
                    groupId,
                    is_on_lesson: attendanceStatuses[index],
                },
            })
        );

        return await Promise.all(operations);
    }
}