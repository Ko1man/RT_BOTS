import { Module } from '@nestjs/common';
import {} from 'telegraf'
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), TelegrafModule.forRoot({
    token: '8089566669:AAGnP0K4bXIWDD7JVlebO1KCLXAuqUtH7Ok',
    launchOptions: {
      dropPendingUpdates: true,
      webhook: {
        domain: 'https://rt-bots.onrender.com',
        hookPath: 'telegram/hookpath',
      }
    }
  }), BotModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
