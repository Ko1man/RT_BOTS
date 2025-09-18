import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { AttendenceService } from './attendence.service';
import { CreateAttendanceDto } from './dto/createAttendence.dto';
import { DeleteAttendanceDto } from './dto/deleteAtt.dto';
import { UpdateAttendanceDto } from './dto/updateAttendance.dto';

@Controller('attendence')
export class AttendenceController {
    constructor(private readonly attendenceService: AttendenceService) {}

    @Post('create')
    async createAttendances(@Body() dto: CreateAttendanceDto) {
        return this.attendenceService.createAttendance(dto);
    }

    @Delete('delete')
    async delete(@Body() dto: DeleteAttendanceDto) {
        return await this.attendenceService.delete(dto.ids);
    }

    @Patch('update/:groupId')
    async updateAttendance(@Param('groupId') groupId: string, @Body() dto: UpdateAttendanceDto) {
        return this.attendenceService.updateAttendance(groupId, dto);
    }
}
