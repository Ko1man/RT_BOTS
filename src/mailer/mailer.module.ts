import { Module } from '@nestjs/common';
import { MailService } from './mailer.service';
import { MailController } from './mailer.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [MailController],
  providers: [MailService, PrismaService, AuthService, JwtService],
})
export class MailerModule {}
