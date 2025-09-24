import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAttendanceDto{
    @IsString({message: ('группа должна быть строкой')})
    groupId: string

    @IsString( {message: ('номер урока должен быть числом')})
    lessonNumberId: string

    @IsArray()
    userIds: string[]

    @IsArray()
    @IsBoolean({ each: true })
    is_on_lesson: boolean[];
}