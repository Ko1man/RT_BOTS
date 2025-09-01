import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Hears, Update, On } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { PrismaService } from 'src/prisma/prisma.service';

interface MyContext extends Context {
  session?: {
    waitingForName?: boolean;
  };
}

@Injectable()
@Update()
export class BotService {
  private readonly logger = new Logger(BotService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Hears('Регистрация')
  async askName(@Ctx() ctx: MyContext) {
    const chatId = ctx.from?.id.toString();
    if (!chatId) return ctx.reply('Не удалось определить ваш ID в Telegram');

    const existingUser = await this.prisma.users.findUnique({
      where: { chatId },
    });

    if (existingUser) {
      return ctx.reply('Вы уже зарегистрированы!');
    }

    ctx.session = { waitingForName: true };
    return ctx.reply('Пожалуйста, введите ваше имя:');
  }

    @On('text')
    async handleName(@Ctx() ctx: MyContext) {
    if (!ctx.session?.waitingForName) return;

    const chatId = ctx.from?.id?.toString();
    if (!chatId) return ctx.reply('Не удалось определить ваш ID в Telegram');

    const username = ctx.from?.username || '';

    if (!ctx.message || !('text' in ctx.message)) return; // проверяем, что текст пришёл
    const nameInput = ctx.message.text.trim();

    await this.prisma.users.create({
        data: {
        chatId,          // теперь точно string
        name: nameInput, // имя, которое ввел пользователь
        fullName: username, // username Telegram
        },
    });

    ctx.session.waitingForName = false;
    return ctx.reply(`Регистрация прошла успешно! Ваше имя: ${nameInput}`);
    }

}
