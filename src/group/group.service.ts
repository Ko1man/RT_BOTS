import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddUsersToGroupDto } from './dto/addUsers.dto';
import { ROLE } from '@prisma/client';

@Injectable()
export class GroupService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllGroups() {
        const groups = await this.prisma.group.findMany();

        if (groups.length === 0) {
            throw new NotFoundException('Не найдено ни одной группы.');
        }

        return groups;
    }

    async createGroup(dto: CreateGroupDto) {
        const { name } = dto;

        try {
            return this.prisma.group.create({
                data: {
                    name,
                },
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Группа с таким названием уже существует.');
            }
            throw error;
        }
    }

    async addUserToGroup(dto: AddUsersToGroupDto) {
        const { userId, groupId } = dto;
        const addUser = await this.prisma.userGroup.create({
            data: {
                userId: userId,
                groupId: groupId,
            },
        });
        return addUser;
    }

    async getGroupById(id: string) {
        const group = await this.prisma.group.findUnique({
            where: { id },
            include: {
                users: true,
                attendances: true,
            },
        });

        if (!group) {
            throw new NotFoundException('Группа не найдена.');
        }

        return group;
    }

    async getUsersByGroupId(groupId: string, role?: ROLE) {
        return this.prisma.user.findMany({
            where: {
                groups: {
                    some: {
                        groupId,
                    },
                },
                ...(role ? { role } : {}),
            },
            select: {
                id: true,
                fullName: true,
                name: true,
                phone: true,
                email: true,
                role: true,
                avatar: true,
                birthday: true,
            },
        });
    }
}
