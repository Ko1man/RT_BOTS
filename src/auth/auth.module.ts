import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GetJwtConfig } from 'src/config/jwt.config';
import { JwtStrategi } from './strategies/jwt.startegi';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: GetJwtConfig,
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, PrismaService, JwtStrategi],
})
export class AuthModule {}
