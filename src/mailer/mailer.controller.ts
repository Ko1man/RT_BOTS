import { BadRequestException, Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { MailService } from './mailer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('mailer')
export class MailController {
  constructor(private readonly mailerService: MailService, private readonly prisma: PrismaService, private readonly authService: AuthService) {}

  @Post('verify-email')
async verifyEmail(
  @Res({ passthrough: true }) res: Response,
  @Body() body: { email: string; code: string },
) {
  const { email, code } = body;

  const ok = await this.mailerService.verifyCode(email, code);

  if (!ok) {
    throw new BadRequestException('Код неверный или истёк');
  }

  const user = await this.prisma.user.update({
    where: { email },
    data: { email_verified: true },
  });

  // Используем твой готовый метод
  return this.authService.auth(res, user.id);
}
}
