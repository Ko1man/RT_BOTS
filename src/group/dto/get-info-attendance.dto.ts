// src/attendance/dto/get-attendance.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class GetAttendanceDto {
    @IsString()
    groupId: string;

    @IsOptional()
    @IsString()
    lessonNumberId?: string;

    @IsOptional()
    @IsString()
    date?: string; // YYYY-MM-DD
}
