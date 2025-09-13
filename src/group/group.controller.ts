import { Body, Controller, Get, Post } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';

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
}
