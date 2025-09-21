import { Module } from '@nestjs/common';
import { GroupModule } from './group/group.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { NewsModule } from './news/news.module';
import { AttendenceModule } from './attendence/attendence.module';
import { FileModule } from './file/file.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        GroupModule,
        PrismaModule,
        AuthModule,
        UserModule,
        NewsModule,
        AttendenceModule,
        FileModule,
        MailerModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
