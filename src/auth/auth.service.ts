import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash, verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { isDev } from 'src/utils/isDev.utils';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthService {
    private readonly COOKIE_DOMAIN: string;
    private readonly JWT_ACCESS_TOKEN_TTL: string;
    private readonly JWT_REFRESH_TOKEN_TTL: string;
    constructor(
        private readonly prismaService: PrismaService,
        private readonly configServise: ConfigService,
        private readonly jwtServise: JwtService,
    ) {
        this.COOKIE_DOMAIN = configServise.getOrThrow<string>('COOKIE_DOMAIN');
        this.JWT_ACCESS_TOKEN_TTL = configServise.getOrThrow<string>('JWT_ACCESS_TOKEN_TTL');
        this.JWT_REFRESH_TOKEN_TTL = configServise.getOrThrow<string>('JWT_REFRESH_TOKEN_TTL');
    }

    async register(res: Response, dto: CreateUserDto) {
        const { email, password, fullName, phone, birthday } = dto;
        const parts = fullName.trim().split(/\s+/);
        const name = parts[1] || fullName;
        const birthdayStr = typeof birthday === 'string' ? birthday : '';
        const [day, month, year] = birthdayStr.split('.').map(Number);
        const parsedBirthday = new Date(year, month - 1, day);

        const existUser = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });

        if (existUser) {
            throw new ConflictException('User with this email already exists');
        }

        const user = await this.prismaService.user.create({
            data: {
                email,
                password: await hash(password),
                name,
                fullName,
                phone,
                birthday: parsedBirthday,
                groupID: dto.groupID,
            },
        });

        return this.auth(res, user.id);
    }

    async login(res: Response, dto: LoginDto) {
        const { email, password } = dto;

        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
                password: true,
            },
        });

        if (!user) {
            throw new NotFoundException('пользователь не найден');
        }

        const isValidPassword = await verify(user.password, password);

        if (!isValidPassword) {
            throw new NotFoundException('пользователь не найден');
        }

        return this.auth(res, user.id);
    }

    async refresh(res: Response, req: Request) {
        const refreshToken = req.cookies['refreshToken'];

        if (!refreshToken) {
            throw new UnauthorizedException('Refresh Token is not valid');
        }

        const payload: JwtPayload = await this.jwtServise.verifyAsync(refreshToken);

        if (payload) {
            const user = await this.prismaService.user.findUnique({
                where: {
                    id: payload.id,
                },
                select: {
                    id: true,
                },
            });
            if (!user) {
                throw new NotFoundException('User not found');
            }

            return this.auth(res, user.id);
        }
    }

    async logout(res: Response) {
        this.setCookie(res, 'refreshToken', new Date(0));
        return true;
    }

    private auth(res: Response, id: string) {
        const { accessToken, refreshToken } = this.generateTokens(id);

        this.setCookie(res, refreshToken, new Date(Date.now() + 1000 * 60 * 60 * 24 * 7));

        return { accessToken };
    }

    private generateTokens(id: string) {
        const payload: JwtPayload = { id };

        const accessToken = this.jwtServise.sign(payload, {
            expiresIn: this.JWT_ACCESS_TOKEN_TTL,
        });

        const refreshToken = this.jwtServise.sign(payload, {
            expiresIn: this.JWT_REFRESH_TOKEN_TTL,
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    private setCookie(res: Response, value: String, expires: Date) {
        res.cookie('refreshToken', value, {
            httpOnly: true,
            domain: this.COOKIE_DOMAIN,
            expires,
            secure: !isDev(this.configServise),
            sameSite: isDev(this.configServise) ? 'none' : 'lax',
        });
    }

    async validate(id: string) {
        const user = this.prismaService.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new NotFoundException();
        }
        return user;
    }
}
