import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guuard';

export const Auth = () => UseGuards(JwtAuthGuard);
