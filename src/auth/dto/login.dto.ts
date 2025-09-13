import { IsEmail, IsNotEmpty, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
export class LoginDto {

    @IsString({ message: 'password shoud be string' })
    @IsNotEmpty({ message: 'password should not be empty' })
    @MinLength(6, { message: 'password should be at least 6 characters' })
    password: string;

    @IsEmail({}, { message: 'email format is invalid' })
    @IsNotEmpty({ message: 'email should not be empty' })
    email: string;
}