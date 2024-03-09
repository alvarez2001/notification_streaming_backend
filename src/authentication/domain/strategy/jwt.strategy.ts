import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthenticationService } from 'src/authentication/application/authentication.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private authenticationService: AuthenticationService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET_KEY'),
            passReqToCallback: true,
        });
    }

    async validate(
        req: Request,
        payload: { sub: number; username: string },
    ): Promise<{ id: number; username: string }> {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Token no proporcionado');
        }

        const isValid = await this.authenticationService.verifyExistToken(token);
        if (!isValid) {
            throw new UnauthorizedException('Token no válido o expirado');
        }
        return { id: payload.sub, username: payload.username };
    }
}
