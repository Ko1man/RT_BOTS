import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAttendanceDto{
    @IsString({message: ('группа должна быть строкой')})
    groupId: string

    @IsNumber({}, {message: ('номер урока должен быть числом')})
    lessonNumber: number

    @IsArray()
    userIds: string[]

    @IsOptional()
    @IsBoolean()
    is_on_lesson: boolean
}