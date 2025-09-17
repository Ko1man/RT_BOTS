import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddUsersToGroupDto } from './dto/addUsers.dto';

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
}
