import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export async function GetJwtConfig(configServise: ConfigService): Promise<JwtModuleOptions> {
    return {
        secret: configServise.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
            algorithm: 'HS256',
        },
        verifyOptions: {
            algorithms: ['HS256'],
            ignoreExpiration: false,
        },
    };
}
