import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AttendenceService } from './attendence.service';
import { CreateAttendanceDto } from './dto/createAttendence.dto';
import { DeleteAttendanceDto } from './dto/deleteAtt.dto';
import { UpdateAttendanceDto } from './dto/updateAttendance.dto';
import { CheckAttendanceDto } from './dto/check-attendance.dto';

@Controller('attendence')
export class AttendenceController {
    constructor(private readonly attendenceService: AttendenceService) {}

    @Get('check/:groupId/:date')
    async checkAttendance(@Param('groupId') groupId: string, @Param('date') date: string) {
        return this.attendenceService.checkAttendance(groupId, date);
    }

    @Get('by-lesson/:groupId/:lessonNumberId/:date')
    async getAttendanceByLesson(@Param('groupId') groupId: string, @Param('lessonNumberId') lessonNumberId: string, @Param('date') date: string) {
        return this.attendenceService.getAttendanceByLesson(groupId, lessonNumberId, date);
    }

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

    @Post('upsert/:groupId')
    async upsertAttendance(@Param('groupId') groupId: string, @Body() dto: UpdateAttendanceDto) {
        return this.attendenceService.upsertAttendance(groupId, dto);
    }

}