import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.use(cookieParser());

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // убирает лишние поля
            forbidNonWhitelisted: true, // запрещает лишние поля
            transform: true, // преобразует к типам DTO
        }),
    );

    app.enableCors({
        origin: 'http://localhost:8081',
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        preflightContinue: false,
    });

    const port = process.env.PORT || 8080; // 3000 только локально
    await app.listen(port);
}
bootstrap();
