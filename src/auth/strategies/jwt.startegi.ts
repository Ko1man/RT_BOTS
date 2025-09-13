import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { JwtPayload } from "jsonwebtoken";
@Injectable()
export class JwtStrategi extends PassportStrategy(Strategy){
    constructor(private readonly authServise: AuthService,
        private readonly configService: ConfigService
    ){
        super ({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
            algorithms: ['HS256']
        });
    }
    async validate(payload: JwtPayload) {
        return await this.authServise.validate(payload.id)
    }
}