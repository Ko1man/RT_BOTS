// src/utils/file-upload.util.ts
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export const avatarFileFilter = (req: any, file: Express.Multer.File, callback: Function) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    return callback(new BadRequestException('Only image files are allowed (jpg, jpeg, png).'), false);
  }
  callback(null, true);
};

export const avatarFileNamer = (req: any, file: Express.Multer.File, callback: Function) => {
  const userId = req.user?.sub || req.user?.id || 'anonymous';
  const fileExtName = extname(file.originalname);
  const fileName = `${userId}-${Date.now()}${fileExtName}`;
  callback(null, fileName);
};

export const avatarMulterOptions = {
  storage: diskStorage({
    destination: './uploads/avatars',
    filename: avatarFileNamer,
  }),
  fileFilter: avatarFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
};
