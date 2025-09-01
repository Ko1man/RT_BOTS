import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Start, Update, Hears } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
@Update()
export class BotService {
    private readonly logger = new Logger(BotService.name);

    constructor(private readonly prisma: PrismaService) {}

    @Start()
    async start(@Ctx() ctx: Context) {
        this.logger.log(`Пользователь ${ctx.from?.username} нажал /start`);
        await ctx.reply('Привет, выбери действие', {
            reply_markup: {
                keyboard: [
                    ['Регистрация', 'Меню']
                ],
                resize_keyboard: true
            }
        });
    }

    // Метод регистрации
    @Hears('Регистрация')
    async register(@Ctx() ctx: Context) {
        const chatId = ctx.from?.id.toString();
        const username = ctx.from?.username || '';
        const fullName = `${ctx.from?.first_name || ''} ${ctx.from?.last_name || ''}`.trim();

        if (!chatId) {
            return ctx.reply('Не удалось определить ваш ID в Telegram');
        }

        // Проверяем, есть ли пользователь
        const existingUser = await this.prisma.users.findUnique({
            where: {chatId}
        });

        if (existingUser) {
            return ctx.reply('Вы уже зарегистрированы!');
        }

        // Создаем нового пользователя
        await this.prisma.users.create({
            data: {
                name: username,
                fullName: fullName,
                chatId: chatId
            }
        });

        this.logger.log(`Зарегистрирован новый пользователь: ${username} (${chatId})`);
        return ctx.reply('Регистрация прошла успешно! 🎉');
    }
}
