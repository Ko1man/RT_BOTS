import { Type } from 'class-transformer';
import {
    IsDate,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    Max,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';
export class CreateUserDto {
    @IsString({ message: 'full name should be string' })
    @IsNotEmpty({ message: 'full name should not be empty' })
    @MinLength(5)
    @MaxLength(128)
    fullName: string;

    @IsString({ message: 'phone shoud be string' })
    @IsNotEmpty({ message: 'phone should not be empty' })
    @MaxLength(12, { message: 'phone should be 11 numbers' })
    @MinLength(12)
    phone: string;

    @IsString({ message: 'password shoud be string' })
    @IsNotEmpty({ message: 'password should not be empty' })
    @MinLength(6, { message: 'password should be at least 6 characters' })
    password: string;

    @IsEmail({}, { message: 'email format is invalid' })
    @IsNotEmpty({ message: 'email should not be empty' })
    email: string;

    @IsNotEmpty({ message: 'birthday should not be empty' })
    @Matches(/^\d{2}\.\d{2}\.\d{4}$/, { message: 'birthday must be in format DD.MM.YYYY' })
    birthday: string;

    @IsOptional()
    @IsString({ message: 'groupID should be string' })
    groupID?: string;
}
