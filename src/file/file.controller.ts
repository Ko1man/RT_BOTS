import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'src/storage/google-cloud.storage';

@Controller('file')
export class FileController {
    constructor(
        private readonly fileService: FileService,
        private readonly storage: StorageService,
    ) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile() file: Express.Multer.File) {
        const url = await this.storage.uploadFile(file);
        return { url };
    }
}
