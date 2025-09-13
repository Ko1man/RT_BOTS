import { IsString, Length } from "class-validator";

export class CreateGroupDto {
    @IsString({ message: 'Название группы должно быть текстом.' })
    @Length(3, 10, { message: 'Название группы должно содержать от 3 до 10 символов.' })
    name: string;
}