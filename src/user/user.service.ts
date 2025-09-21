import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { UpdateUserDto } from './dto/updateUser.dto';
import { hash } from 'argon2';
import { Prisma, ROLE } from '@prisma/client';

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

    async getPendingStatus() {
        return await this.prisma.user.findMany({
            where: {
                on_check: 'PENDING',
            },
            orderBy: { createdAt: 'asc' },
        });
    }

    async reviewUsers(userID: string, status: 'APPROVED' | 'REJECTED') {
        return await this.prisma.user.update({
            where: { id: userID },
            data: {
                on_check: status,
            },
        });
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
}
