import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import path, { join } from 'path';

@Injectable()
export class StorageService {
    private storage: Storage;
    private bucketName = 'file_bucket_anvarismailov';

    constructor() {
        this.storage = new Storage({
             keyFilename: path.join(process.cwd(), 'internet-key.json'),// ключ сервисного аккаунта
            projectId: 'anvarismailov', // замени на свой projectId
        });
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const bucket = this.storage.bucket(this.bucketName);
        const blob = bucket.file(file.originalname);

        const stream = blob.createWriteStream({
            resumable: false,
            contentType: file.mimetype,
            // predefinedAcl: 'publicRead', // сразу делаем публичным
        });

        return new Promise((resolve, reject) => {
            stream.on('error', (err) => reject(err));
            stream.on('finish', () => {
                const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${blob.name}`;
                resolve(publicUrl);
            });
            stream.end(file.buffer);
        });
    }
}
