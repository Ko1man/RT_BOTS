import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddUsersToGroupDto } from './dto/addUsers.dto';

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

    @Get('by-id/:id')
    async getById(@Param('id') id: string) {
        return await this.groupService.getGroupById(id);
    }
}
