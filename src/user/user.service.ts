import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { UpdateUserDto } from './dto/updateUser.dto';
import { hash } from 'argon2';
import { CHECK_STATUS, Prisma, ROLE } from '@prisma/client';
import { UpdateUserStatusDto } from './dto/update-status.dto';
import { FilterUsersDto } from './dto/filter-users.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async updateAvatar(userId: string, avatarUrl: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        // Удаляем старый файл (если есть)
        if (user.avatar) {
            try {
                const oldRelative = user.avatar.replace(/^\//, ''); // например "uploads/avatars/old.png"
                const oldFullPath = join(process.cwd(), oldRelative);
                await unlink(oldFullPath).catch(() => null);
            } catch (err) {
                // игнорируем ошибки удаления
            }
        }

        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: { avatar: avatarUrl },
        });

        return updated;
    }

    async getUserByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email: email },
            include: { groups: true },
        });
        return user;
    }

    async getUserByIdForCurr(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { groups: true },
        });
        return user;
    }

    async updateProfile(id: string, dto: UpdateUserDto) {
        const existUser = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!existUser) {
            throw new BadRequestException('Пользователь не найден');
        }

        const user = await this.prisma.user.update({
            where: { id },
            data: {
                ...dto,
                ...(dto.password && {
                    password: await hash(dto.password),
                }),
            },
        });

        return user;
    }

    async getAll() {
        return await this.prisma.user.findMany();
    }

    async searchUsers(query: string, roles: ROLE[], page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const where = {
            AND: [
                roles.length > 0 ? { role: { in: roles as any[] } } : {},
                {
                    OR: [
                        { fullName: { contains: query, mode: 'insensitive' as Prisma.QueryMode } },
                        { name: { contains: query, mode: 'insensitive' as Prisma.QueryMode } },
                        { phone: { contains: query, mode: 'insensitive' as Prisma.QueryMode } },
                        { email: { contains: query, mode: 'insensitive' as Prisma.QueryMode } },
                    ],
                },
            ],
        };

        const [items, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                where,
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                    role: true,
                    avatar: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);

        return { items, total, page, limit };
    }

    async getUserById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                groups: {
                    include: {
                        group: true,
                    },
                },
            },
        });
        return user;
    }

    async getPendingUsersWithFilter(dto: FilterUsersDto) {
        const page = dto.page ?? 1;
        const limit = dto.limit ?? 10;

        const where: any = { on_check: CHECK_STATUS.PENDING };
        if (dto.roles && dto.roles.length > 0) {
            where.role = { in: dto.roles };
        }

        const [data, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    groups: {
                        include: {
                            group: true
                        }
                    }
                }
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async updateUserStatus(dto: UpdateUserStatusDto) {
        const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
        if (!user) throw new NotFoundException('Заявка не найдена.');

        if (dto.status === CHECK_STATUS.APPROVED) {
            return this.prisma.user.update({
                where: { id: dto.userId },
                data: { on_check: CHECK_STATUS.APPROVED },
            });
        }

        return this.prisma.user.delete({ where: { id: dto.userId } });
    }
}
