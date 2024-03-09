import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
    OAUTH2CREDENTIAL_REPOSITORY_INTERFACE,
    Oauth2credentialRepositoryInterface,
} from '../domain/interfaces/oauth2credentialRepository.interface';
import { Oauth2credential } from '../domain/entity/oauth2credential.entity';
import { CreateOauth2credentialDto } from '../interfaces/api/dto/create-oauth2credential.dto';
import { UpdateOauth2credentialDto } from '../interfaces/api/dto/update-oauth2credential.dto';
import { Oauth2credentialResponseDto } from '../interfaces/api/dto/oauth2credential-response.dto';
import { plainToClass } from 'class-transformer';
import * as bcryptjs from 'bcryptjs';
import { SearchCriteriaDto } from '@shared/interfaces/search-criteria.dto';
import { PaginateResponseDto } from '@shared/interfaces/paginate-response.dto';
const crypto = require('crypto');
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { TwitterHttpInterface } from '../domain/interfaces/twitter.http.interface';

@Injectable()
export class Oauth2credentialService {
    constructor(
        @Inject(OAUTH2CREDENTIAL_REPOSITORY_INTERFACE)
        private oauth2credentialRepository: Oauth2credentialRepositoryInterface,
        private configService: ConfigService,
        private readonly httpService: HttpService,
    ) {}

    async createOauth2credential(
        createOauth2credentialDto: CreateOauth2credentialDto,
    ): Promise<Oauth2credentialResponseDto> {
        const oauth2credential = new Oauth2credential();
        Object.assign(oauth2credential, createOauth2credentialDto);
        await this.oauth2credentialRepository.create(oauth2credential);
        return plainToClass(Oauth2credentialResponseDto, oauth2credential, {
            excludeExtraneousValues: true,
        });
    }

    async updateOauth2credential(
        id: number,
        updateOauth2credentialDto: UpdateOauth2credentialDto,
    ): Promise<Oauth2credentialResponseDto> {
        const oauth2credential = await this.oauth2credentialRepository.findById(id);
        if (!oauth2credential) {
            throw new Error('Oauth2credential not found');
        }
        Object.assign(oauth2credential, updateOauth2credentialDto);

        await this.oauth2credentialRepository.update(id, oauth2credential);
        return plainToClass(Oauth2credentialResponseDto, oauth2credential, {
            excludeExtraneousValues: true,
        });
    }

    async findOauth2credentialById(id: number): Promise<Oauth2credentialResponseDto> {
        const oauth2credential = await this.oauth2credentialRepository.findById(id);

        return plainToClass(Oauth2credentialResponseDto, oauth2credential, {
            excludeExtraneousValues: true,
        });
    }

    async findAllOauth2credentials(userId: number): Promise<Oauth2credentialResponseDto[]> {
        const oauth2credentials = await this.oauth2credentialRepository.findByUserId(userId);
        return oauth2credentials.map(oauth2credential =>
            plainToClass(Oauth2credentialResponseDto, oauth2credential, {
                excludeExtraneousValues: true,
            }),
        );
    }

    async deleteOauth2credential(userId: number, platform: string): Promise<void> {
        return this.oauth2credentialRepository.deleteByUserAndPlatform(userId, platform);
    }

    async pagination(
        criteria: SearchCriteriaDto,
    ): Promise<PaginateResponseDto<Oauth2credentialResponseDto>> {
        const pagination: PaginateResponseDto<Oauth2credential> =
            await this.oauth2credentialRepository.pagination(criteria);

        const paginationResponse: PaginateResponseDto<Oauth2credentialResponseDto> = {
            ...pagination,
            data: [],
        };

        paginationResponse.data = pagination.data.map((oauth2credential: Oauth2credential) => {
            return plainToClass(Oauth2credentialResponseDto, oauth2credential, {
                excludeExtraneousValues: true,
            });
        });

        return paginationResponse;
    }

    async getUriOAuth2(
        createOauth2credentialDto: CreateOauth2credentialDto,
        request: Request & { user: { id: number; username: string } },
    ): Promise<{ data: string }> {
        const uriOAuths = {
            twitter: 'https://twitter.com/i/oauth2/authorize',
        };

        const redirecUriOAuths = {
            twitter: `${this.configService.get('URL_APP')}/api/oauth2credentials/callback/twitter`,
        };
        const scopesOAuth = {
            twitter: ['tweet.write', 'offline.access'],
        };
        const platform = createOauth2credentialDto.platform;

        if (!uriOAuths.hasOwnProperty(platform)) {
            throw new Error('OAuth2 no implemented');
        }

        const redirectUri = redirecUriOAuths[platform];
        const scopes = scopesOAuth[platform];
        let authUrl = uriOAuths[platform];

        const clientId = this.configService.get('TWITTER_CLIENT_ID');

        const codeVerifier = crypto
            .randomBytes(30)
            .toString('base64url')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
        const codeChallenge = crypto
            .createHash('sha256')
            .update(codeVerifier)
            .digest('base64url')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');

        const state = this.encrypt(JSON.stringify({ id: request.user.id, codeVerifier }));

        authUrl = `${authUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(' '))}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

        return {
            data: authUrl,
        };
    }

    async callbackOAuth(platform: string, code: string, stateEncripted: string): Promise<any> {
        const platformsAvailable = {
            twitter: this.implementationTwitterOAuth,
        };

        if (!platformsAvailable.hasOwnProperty(platform)) {
            throw new Error('OAuth2 no implemented');
        }
        const state = this.decrypt(stateEncripted);

        await platformsAvailable[platform].bind(this)(code, state);

        return;
    }

    async implementationTwitterOAuth(code: string, state: string) {
        const clientId = this.configService.get('TWITTER_CLIENT_ID');
        const clientSecret = this.configService.get('TWITTER_CLIENT_SECRET');
        const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const userId = JSON.parse(state).id;
        const codeVerifier = JSON.parse(state).codeVerifier;
        const tokenUrl = 'https://api.twitter.com/2/oauth2/token';
        const redirecUri = `${this.configService.get('URL_APP')}/api/oauth2credentials/callback/twitter`;
        let oauth2Credential = await this.oauth2credentialRepository.findByUserIdAndPlatform(userId, 'twitter');

        if(!oauth2Credential) {
            const dataOAuth2 = new Oauth2credential();
            dataOAuth2.authTimestamp = new Date();
            dataOAuth2.platform = 'twitter';
            dataOAuth2.status = 'in_progress'
            dataOAuth2.userId = userId;
            oauth2Credential = await this.oauth2credentialRepository.create(dataOAuth2);
        }

        const dataSend = {
            client_id: clientId,
            client_secret: clientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: redirecUri,
            code_verifier: codeVerifier,
        };

        const response = this.httpService.post(tokenUrl, dataSend, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${credentials}`,
            },
        });

        response.subscribe({
            next: async ({ data }: { data: TwitterHttpInterface }) => {
                const now = new Date();
                now.setTime(now.getTime() + data.expires_in * 1000);

                await this.oauth2credentialRepository.update(oauth2Credential.id, {
                    status: 'filled',
                    accessToken: data.access_token,
                    refreshToken: data.refresh_token,
                    scope: data.scope,
                    tokenExpiry: data.expires_in,
                    dateExpiry: now
                })
            },
            error: async error => {
                console.log(`error -> ${error}`);

                await this.oauth2credentialRepository.update(oauth2Credential.id, {
                    status: 'refused'
                })
            },
        });

        return;
    }

    private encrypt(text: string) {
        const algorithm = 'aes-256-cbc';
        const key = Buffer.from(this.configService.get('KEY_AES_ENCRIPT'));
        const iv = Buffer.from(this.configService.get('IV_AES_ENCRIPT'));
        let cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('hex');
    }

    private decrypt(encryptedText: string) {
        const algorithm = 'aes-256-cbc';
        const key = Buffer.from(this.configService.get('KEY_AES_ENCRIPT'));
        const iv = Buffer.from(this.configService.get('IV_AES_ENCRIPT'));
        let encryptedBuffer = Buffer.from(encryptedText, 'hex');
        let decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedBuffer);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}
