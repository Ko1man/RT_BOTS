import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CheckStatusGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request.user?.id; // допустим, ты кладешь id пользователя в request.user
        console.log(request.headers.authorization);
        console.log(request.user);

        if (!userId) {
            throw new ForbiddenException('Пользователь не авторизован');
        }

        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        if (user.on_check === 'REJECTED') {
            throw new ForbiddenException('Ваша заявка на регистрацию отклонена');
        } else if (user.on_check !== 'APPROVED') {
            throw new ForbiddenException('Ваш аккаунт на рассмотрении');
        }

        return true;
    }
}
