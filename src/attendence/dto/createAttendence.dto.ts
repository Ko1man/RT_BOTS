import { IsArray, IsString } from "class-validator";

export class CreateAttendanceDto{
    @IsString()
    groupId: string

    @IsString()
    lessonNumberId: string

    @IsArray()
    userIds: string[]
}