import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Req,
    BadRequestException,
    Patch,
    Body,
    Get,
    ForbiddenException,
    Param,
    UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { avatarMulterOptions } from 'src/utils/fileUpload.util';
import { Auth } from 'src/decorators/auth.decorator';
import { CurrentUser } from 'src/decorators/cureentUser.decorator';
import { UpdateUserDto } from './dto/updateUser.dto';
import { OnCheck } from 'src/decorators/onCheck.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guuard';
import { CheckStatusGuard } from 'src/auth/guards/checkStatus.guard';

@Controller('user')
export class UserController {
    constructor(private readonly usersService: UserService) {}

    @Post('avatar')
    @UseGuards(JwtAuthGuard, CheckStatusGuard)
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

    @UseGuards(JwtAuthGuard, CheckStatusGuard)
    @Patch('update-profile/:userId')
    async updateUser(@CurrentUser('id') userId: string, @Body() dto: UpdateUserDto) {
        return this.usersService.updateProfile(userId, dto);
    }

    @UseGuards(JwtAuthGuard, CheckStatusGuard)
    @Get('getUser/:email')
    async getUserByEmail(@CurrentUser('email') email: string) {
        return this.usersService.getUserByEmail(email);
    }

    @UseGuards(JwtAuthGuard, CheckStatusGuard)
    @Get('getUser/:id')
    async getUserById(@CurrentUser('id') id: string) {
        return this.usersService.getUserById(id);
    }

    @UseGuards(JwtAuthGuard, CheckStatusGuard)
    @Get('get-all')
    async getAllUsers(@CurrentUser('id') id: string) {
        console.log(id)
        return this.usersService.getAll();
    }


    @UseGuards(JwtAuthGuard, CheckStatusGuard)
    @Get('on-check')
    async getPendingUsers(@CurrentUser('role') role: string) {
        if (role != 'ADMIN') {
            throw new ForbiddenException('У вас нет прав доступа, обратитесь к администратору');
        }

        return this.usersService.getPendingStatus();
    }

    @UseGuards(JwtAuthGuard, CheckStatusGuard)
    @Post('review/:id')
    async reviewUser(
        @CurrentUser('role') role: string,
        @Param('id') id: string,
        @Body('status') status: 'APPROVED' | 'REJECTED',
    ) {
        if (role !== 'ADMIN') {
            throw new ForbiddenException('У вас нет прав доступа, обратитесь к администратору');
        }
        return this.usersService.reviewUsers(id, status);
    }
}
