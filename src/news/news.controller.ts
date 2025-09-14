import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateNewsDto } from './dto/create-news.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { UpdateNewsDto } from './dto/update-news.dto copy';

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}
    @Auth()
    @Post('create-news')
    @UseInterceptors(
        FilesInterceptor('images', 10, {
            storage: diskStorage({
                destination: './uploads/news',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    callback(
                        null,
                        file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
                    );
                },
            }),
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                    return callback(
                        new BadRequestException('Только изображения можно загружать!'),
                        false,
                    );
                }
                callback(null, true);
            },
        }),
    )
    async create(@Body() dto: CreateNewsDto, @UploadedFiles() files: Express.Multer.File[]) {
        if (files.length > 10) {
            throw new BadRequestException('Максимум 10 фотографий!');
        }

        const fileNames = files.map((file) => file.filename);

        // Передаём DTO и массив названий файлов в сервис
        return this.newsService.createNews(dto, fileNames);
    }

    @Auth()
    @Patch('update-news/:id')
    @UseInterceptors(
        FilesInterceptor('images', 10, {
            storage: diskStorage({
                destination: './uploads/news',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    callback(
                        null,
                        file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
                    );
                },
            }),
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                    return callback(
                        new BadRequestException('Только изображения можно загружать!'),
                        false,
                    );
                }
                callback(null, true);
            },
        }),
    )
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateNewsDto,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        if (files.length > 10) {
            throw new BadRequestException('Максимум 10 фотографий!');
        }

        const fileNames = files.map((file) => file.filename);

        // Передаём DTO и массив названий файлов в сервис
        return this.newsService.updateNews(id, dto, fileNames);
    }

    @Auth()
    @Get()
    async getAllNews(){
      return this.newsService.getAllNews()
    }

    @Auth()
    @Get(':id')
    async getOneNews(@Param('id') id: string){
      return this.newsService.geOneNews(id)
    }

    @Auth()
    @Delete('delete-news/:id')
    async deleteNews(@Param('id') id: string){
      return this.newsService.deleteNews(id)
    }
}
