import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CHECK_STATUS } from '@prisma/client';

export class UpdateUserStatusDto {
    @IsString()
    userId: string;

    @IsEnum(CHECK_STATUS)
    @IsOptional()
    status?: CHECK_STATUS;
}
