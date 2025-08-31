import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Injectable()
@Update()
export class BotService {
    private readonly logger = new Logger(BotService.name)
    @Start()
    async start(@Ctx() ctx: Context){
        this.logger.log(`Пользователь ${ctx.from?.username} нажал /start`)
        await ctx.reply('Привет, выбери действие',{
            reply_markup: {
                keyboard : [
                    ['Регистрация', 'Меню']
                ],
                resize_keyboard: true
            }
        })
    }
}
