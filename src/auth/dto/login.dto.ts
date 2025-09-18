import { IsEmail, IsNotEmpty, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
export class LoginDto {

    @IsString({ message: 'пароль должен быть строкой' })
    @IsNotEmpty({ message: 'пароль не должен быть пустым' })
    @MinLength(6, { message: 'пароль не должен быть короче 6 символов' })
    password: string;

    @IsEmail({}, { message: 'неверный формат Email' })
    @IsNotEmpty({ message: 'Email не должен быть пустым' })
    email: string;
}