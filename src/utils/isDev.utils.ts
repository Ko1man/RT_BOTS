import { ConfigService } from '@nestjs/config';

export const isDev = (configServise: ConfigService) =>
    configServise.getOrThrow('NODE_ENV') === 'development';
