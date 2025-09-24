import { IsString } from "class-validator";

export class CreateLessonNumberDto{
    @IsString()
    lessonNumber: string

    @IsString()
    shift: string
}