import {
    Controller,
    Post,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Req,
    BadRequestException,
    Patch,
    Body,
    Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { avatarMulterOptions } from 'src/utils/fileUpload.util';
import { Auth } from 'src/decorators/auth.decorator';
import { CurrentUser } from 'src/decorators/cureentUser.decorator';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('user')
export class UserController {
    constructor(private readonly usersService: UserService) {}

    @Post('avatar')
    @Auth()
    @UseInterceptors(FileInterceptor('avatar', avatarMulterOptions))
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
        if (!file) throw new BadRequestException('File is required');

        // Получаем id пользователя из payload JWT — зависит от того, что ты кладёшь в payload (sub / id)
        const userId = req.user?.sub || req.user?.id;
        if (!userId) throw new BadRequestException('User not found in request');

        const avatarUrl = `/uploads/avatars/${file.filename}`;

        const updatedUser = await this.usersService.updateAvatar(userId, avatarUrl);

        return {
            message: 'Avatar uploaded successfully',
            avatar: avatarUrl,
            user: { id: updatedUser.id, avatar: updatedUser.avatar },
        };
    }

    @Auth()
    @Patch('update-profile/:userId')
    async updateUser(@CurrentUser('id') userId: string, @Body() dto: UpdateUserDto) {
        return this.usersService.updateProfile(userId, dto);
    }

    @Auth()
    @Get('getUser/:email')
    async getUserByEmail(@CurrentUser('email') email: string) {
        return this.usersService.getUserByEmail(email);
    }

    @Auth()
    @Get('getUser/:id')
    async getUserById(@CurrentUser('id') id: string) {
        return this.usersService.getUserById(id);
    }

    @Get('get-all')
    async getAllUsers() {
        return this.usersService.getAll();
    }
}
