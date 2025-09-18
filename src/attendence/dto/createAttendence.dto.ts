import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateAttendanceDto{
    @IsString({message: ('группа должна быть строкой')})
    groupId: string

    @IsString({message: ('номер урока должен быть строкой')})
    lessonNumberId: string

    @IsArray()
    userIds: string[]

    @IsOptional()
    @IsBoolean()
    is_on_lesson: boolean
}