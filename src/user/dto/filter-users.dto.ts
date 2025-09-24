import { IsArray, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ROLE } from '@prisma/client';

export class FilterUsersDto {
    @IsOptional()
    @Transform(({ value }) => {
        // если пришла одна строка — делаем массив
        if (!value) return [];
        return Array.isArray(value) ? value : [value];
    })
    @IsEnum(ROLE, { each: true })
    roles?: ROLE[];

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;
}
