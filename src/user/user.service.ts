import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateAvatar(userId: string, avatarUrl: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Удаляем старый файл (если есть)
    if (user.avatar) {
      try {
        const oldRelative = user.avatar.replace(/^\//, ''); // например "uploads/avatars/old.png"
        const oldFullPath = join(process.cwd(), oldRelative);
        await unlink(oldFullPath).catch(() => null);
      } catch (err) {
        // игнорируем ошибки удаления
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
    });

    return updated;
  }
}
