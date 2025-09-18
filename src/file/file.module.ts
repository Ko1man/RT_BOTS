import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { StorageService } from 'src/storage/google-cloud.storage';

@Module({
  controllers: [FileController],
  providers: [FileService, StorageService],
})
export class FileModule {}
