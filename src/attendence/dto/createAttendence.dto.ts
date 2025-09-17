import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateAttendanceDto{
    @IsString()
    groupId: string

    @IsString()
    lessonNumberId: string

    @IsArray()
    userIds: string[]

    @IsOptional()
    @IsBoolean()
    is_on_lesson: boolean
}