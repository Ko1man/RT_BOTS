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
    Param,
    UseGuards,
    Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { avatarMulterOptions } from 'src/utils/fileUpload.util';
import { CurrentUser } from 'src/decorators/cureentUser.decorator';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guuard';
import { CheckStatusGuard } from 'src/auth/guards/checkStatus.guard';
import { ROLE } from '@prisma/client';
import { FilterUsersDto } from './dto/filter-users.dto';
import { UpdateUserStatusDto } from './dto/update-status.dto';

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
    @Get('getUser')
    async getUserByIdForCurr(@CurrentUser('id') id: string) {
        return this.usersService.getUserByIdForCurr(id);
    }

    @UseGuards(JwtAuthGuard, CheckStatusGuard)
    @Get('get-all')
    async getAllUsers(@CurrentUser('id') id: string) {
        console.log(id)
        return this.usersService.getAll();
    }

    @Get('search-users')
    async searchUsers(
        @Query('q') q: string,
        @Query('role') role: ROLE[] | ROLE,
        @Query('page') page = '1',
        @Query('limit') limit = '20',
    ) {
        const roles = Array.isArray(role) ? role : role ? [role] : [];
        return this.usersService.searchUsers(q || '', roles, +page, +limit);
    }

    @Get('get-user/:id')
    async getUserById(@Param('id') id: string) {
        return this.usersService.getUserById(id);
    }

    @Get('pending')
    async getPendingUsers(@Query() query: FilterUsersDto) {
        return this.usersService.getPendingUsersWithFilter(query);
    }

    @Post('status')
    async updateStatus(@Body() dto: UpdateUserStatusDto) {
        return this.usersService.updateUserStatus(dto);
    }
}
