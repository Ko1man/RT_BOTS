import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddUsersToGroupDto } from './dto/addUsers.dto';
import { ROLE } from '@prisma/client';

@Controller('groups')
export class GroupController {
    constructor(private readonly groupService: GroupService) {}

    @Get('find-all-group')
    async getAllGroups() {
        return this.groupService.getAllGroups();
    }

    @Post('create-group')
    async createGroup(@Body() dto: CreateGroupDto) {
        return this.groupService.createGroup(dto);
    }

    @Post('add-users')
    async addUsersToGroup(@Body() dto: AddUsersToGroupDto) {
        return this.groupService.addUserToGroup(dto);
    }

    @Get('get-group-by-id/:id')
    async getGroupById(@Param('id') id: string) {
        return this.groupService.getGroupById(id);
    }

    @Get('users-by-group/:groupId')
    async getUsersByGroup(@Param('groupId') groupId: string, @Query('role') role?: ROLE) {
        return this.groupService.getUsersByGroupId(groupId, role);
    }
}
