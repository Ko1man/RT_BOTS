import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;
    constructor(private readonly prisma: PrismaService) {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }

    async sendVerificationCode(to: string, code: string) {
        await this.transporter.sendMail({
            from: `"Мой проект" <${process.env.MAIL_USER}>`,
            to,
            subject: 'Подтверждение email',
            text: `Ваш код подтверждения: ${code}`,
            html: `<p>Ваш код подтверждения: <b>${code}</b></p>`,
        });
    }

    async generateCode(email: string) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        await this.prisma.verificationCode.create({
            data: {
                email,
                code,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            },
        });
        return code;
    }

    async verifyCode(email: string, code: string) {
        const record = await this.prisma.verificationCode.findFirst({
            where: { email, code, used: false },
        });

        if (!record) {
            throw new Error('Код неверный');
        }

        if (record.expiresAt < new Date()) {
            throw new Error('Код истёк');
        }

        // отмечаем как использованный
        await this.prisma.verificationCode.update({
            where: { id: record.id },
            data: { used: true },
        });

        // тут можно обновить пользователя (emailVerified = true)
        return true;
    }
}
