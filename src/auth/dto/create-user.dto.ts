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
    @IsString({ message: 'ФИО должно быть строкой' })
    @IsNotEmpty({ message: 'ФИО не должно быть пустым' })
    @MinLength(5)
    @MaxLength(128)
    fullName: string;

    @IsString({ message: 'Телефон должно быть строкой' })
    @IsNotEmpty({ message: 'Телефон не должен быть пустым' })
    @MaxLength(12, { message: 'телефон не должен быть длиннее 12 символов' })
    @MinLength(12)
    phone: string;

    @IsString({ message: 'пароль должен быть строкой' })
    @IsNotEmpty({ message: 'пароль не должен быть пустым' })
    @MinLength(6, { message: 'пароль не должен быть короче 6 символов' })
    password: string;

    @IsEmail({}, { message: 'неверный формат Email' })
    @IsNotEmpty({ message: 'Email не должен быть пустым' })
    email: string;

    @IsNotEmpty({ message: 'дата рождения не должна быть пустой' })
    @Matches(/^\d{2}\.\d{2}\.\d{4}$/, { message: 'дата рождения должна быть формата ДД.ММ.ГГГГ' })
    birthday: string;

    @IsOptional()
    @IsString({ message: 'группа должна быть строкой' })
    groupID?: string;
}
