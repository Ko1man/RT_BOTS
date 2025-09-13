import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { CurrentUser } from 'src/decorators/cureentUser.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(201)
    @Post('register')
    async register(@Body() dto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
        return await this.authService.register(res, dto);
    }

    @HttpCode(200)
    @Post('login')
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        return await this.authService.login(res, dto);
    }

    @HttpCode(200)
    @Post('refresh')
    async refresh(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
        return await this.authService.refresh(res, req);
    }

    @HttpCode(200)
    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        return await this.authService.logout(res);
    }

    @Auth()
    @HttpCode(200)
    @Get('@me')
    async me(@Req() req: Request) {
        return req.user;
    }
}
