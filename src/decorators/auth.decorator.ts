import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guuard';

export function Auth() {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
