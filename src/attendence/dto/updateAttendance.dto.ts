import { IsArray, IsString, ArrayNotEmpty, IsBoolean } from 'class-validator';

export class UpdateAttendanceDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    userIds: string[];

    @IsString()
    lessonNumberId: string;

    @IsArray()
    @IsBoolean({ each: true })
    attendanceStatuses: boolean[];
}
