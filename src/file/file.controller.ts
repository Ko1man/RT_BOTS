import { Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'src/storage/google-cloud.storage';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guuard';

@Controller('file')
export class FileController {
    constructor(
        private readonly fileService: FileService,
        private readonly storage: StorageService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req) {
        const userId = req.user.id;
        return this.storage.uploadAvatar(file, userId);
    }
}
