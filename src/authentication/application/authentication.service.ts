import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
    AUTHENTICATION_REPOSITORY_INTERFACE,
    AuthenticationRepositoryInterface,
} from '../domain/interfaces/authenticationRepository.interface';
import { Authentication } from '../domain/entity/authentication.entity';
import { CreateAuthenticationDto } from '../interfaces/api/dto/create-authentication.dto';
import { UpdateAuthenticationDto } from '../interfaces/api/dto/update-authentication.dto';
import { AuthenticationResponseDto } from '../interfaces/api/dto/authentication-response.dto';
import { plainToClass } from 'class-transformer';
import { UserService } from '../../user/application/user.service';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
    constructor(
        @Inject(AUTHENTICATION_REPOSITORY_INTERFACE)
        private authenticationRepository: AuthenticationRepositoryInterface,
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async createAuthentication(
        createAuthenticationDto: CreateAuthenticationDto,
    ): Promise<AuthenticationResponseDto> {
        const authentication = new Authentication();
        Object.assign(authentication, createAuthenticationDto);
        await this.authenticationRepository.create(authentication);
        return plainToClass(AuthenticationResponseDto, authentication, {
            excludeExtraneousValues: true,
        });
    }

    async updateAuthentication(
        id: number,
        updateAuthenticationDto: UpdateAuthenticationDto,
    ): Promise<AuthenticationResponseDto> {
        const authentication = await this.authenticationRepository.findById(id);
        if (!authentication) {
            throw new Error('Authentication not found');
        }
        Object.assign(authentication, updateAuthenticationDto);
        await this.authenticationRepository.update(id, authentication);
        return plainToClass(AuthenticationResponseDto, authentication, {
            excludeExtraneousValues: true,
        });
    }

    async findAuthenticationById(id: number): Promise<AuthenticationResponseDto> {
        const authentication = await this.authenticationRepository.findById(id);

        return plainToClass(AuthenticationResponseDto, authentication, {
            excludeExtraneousValues: true,
        });
    }

    async findAllAuthentications(): Promise<AuthenticationResponseDto[]> {
        const authentications = await this.authenticationRepository.findAll();
        return authentications.map(authentication =>
            plainToClass(AuthenticationResponseDto, authentication, {
                excludeExtraneousValues: true,
            }),
        );
    }

    async deleteAuthentication(id: number): Promise<void> {
        return this.authenticationRepository.delete(id);
    }

    async signIn(username: string, password: string): Promise<AuthenticationResponseDto> {
        const user = await this.userService.findByUsername(username);
        if (!user) {
            throw new UnauthorizedException({ msg: 'Invalid credentials' });
        }

        const isValidCredentials = bcryptjs.compareSync(password, user.password);

        if (!isValidCredentials) {
            throw new UnauthorizedException({ msg: 'Invalid credentials' });
        }

        let authentication = await this.authenticationRepository.findByUserId(user.id);

        const payload = {
            username: user.username,
            sub: user.id,
        };
        const token = this.jwtService.sign(payload);
        const expiresIn = parseInt(this.configService.get('JWT_EXPIRATION_HOURS')) * 60 * 60;
        const expirationDate = new Date();
        expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);

        const expirationDateSeconds = Math.floor(expirationDate.getTime() / 1000);
        if (!authentication) {
            authentication = new Authentication();
            authentication.user = user;
            authentication.token = token;
            authentication.expireIn = expirationDateSeconds.toString();
            authentication = await this.authenticationRepository.create(authentication);
        } else {
            Object.assign(authentication, {
                token: token,
                expireIn: expirationDateSeconds.toString(),
            });

            authentication = await this.authenticationRepository.update(
                authentication.id,
                authentication,
            );
        }

        authentication = await this.authenticationRepository.findById(authentication.id);

        return plainToClass(AuthenticationResponseDto, authentication, {
            excludeExtraneousValues: true,
        });
    }

    async verifyExistToken(token: string): Promise<AuthenticationResponseDto> {
        const existToken = await this.authenticationRepository.findByToken(token);
        return plainToClass(AuthenticationResponseDto, existToken, {
            excludeExtraneousValues: true,
        });
    }
}
