import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateNewsDto{
    @IsString({message: 'Название должно быть строкой'})
    @IsNotEmpty({message: 'Название не должно быть пустым'})
    title: string

    @IsString({message: 'Краткое описание должно быть строкой'})
    @IsNotEmpty({message: 'Краткое описание не должно быть пустым'})
    @MaxLength(100)
    @MinLength(20)
    short_description: string

    @IsString({message: 'Полное описание должно быть строкой'})
    @IsNotEmpty({message: 'Полное описание не должно быть пустым'})
    @MaxLength(500)
    @MinLength(100)
    full_description: string
}