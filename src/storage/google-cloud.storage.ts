import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import path, { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StorageService {
    private storage: Storage;
    private bucketName = 'file_bucket_anvarismailov_new';

    constructor(private readonly prisma: PrismaService) {
        this.storage = new Storage({
             keyFilename: path.join(process.cwd(), 'internet-key.json'),// ключ сервисного аккаунта
            projectId: 'anvarismailov', // замени на свой projectId
        });
    }

    async uploadAvatar(file: Express.Multer.File, userId: string): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(file.originalname);

    const stream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
    });

    return new Promise((resolve, reject) => {
        stream.on("error", (err) => reject(err));
        stream.on("finish", async () => {
            try {
                const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${blob.name}`;

                // сохраняем URL в БД у пользователя
                await this.prisma.user.update({
                    where: { id: userId },
                    data: { avatar: publicUrl },
                });

                resolve(publicUrl);
            } catch (err) {
                reject(err);
            }
        });
        stream.end(file.buffer);
    });
}

}
