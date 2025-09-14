import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateUserDto } from 'src/user/dto/updateUser.dto';
import { UpdateNewsDto } from './dto/update-news.dto copy';

@Injectable()
export class NewsService {
    constructor(private readonly prisma: PrismaService) {}

    async createNews(dto: CreateNewsDto, fileNames: string[]) {
        const { title, short_description, full_description } = dto;

        const news = await this.prisma.news.create({
            data: {
                title,
                short_description,
                full_description,
                news_photo: fileNames,
            },
        });

        return news;
    }

    async updateNews(id: string, dto: UpdateNewsDto, fileNames: string[]) {
        const news = await this.prisma.news.update({
            where: { id },
            data: {
                ...dto,
                news_photo: fileNames,
            },
        });
        return news;
    }


    async geOneNews(id: string){
        return await this.prisma.news.findUnique({
            where: {id}
        })
    }

    async getAllNews(){
        return await this.prisma.news.findMany()
    }

    async deleteNews(id: string){
        const news = await this.prisma.news.delete({
            where: {id}
        })

        return news;
    }
}
