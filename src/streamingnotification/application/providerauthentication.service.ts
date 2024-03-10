import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
    PROVIDER_AUTHENTICATION_REPOSITORY_INTERFACE,
    ProviderAuthenticationRepositoryInterface,
} from '../domain/interfaces/providerauthenticationRepository.interface';
import { ProviderAuthentication } from '../domain/entity/providerauthentication.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProviderAuthenticationService implements OnApplicationBootstrap {
    constructor(
        @Inject(PROVIDER_AUTHENTICATION_REPOSITORY_INTERFACE)
        private providerAuthenticationRepository: ProviderAuthenticationRepositoryInterface,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {}

    onApplicationBootstrap() {
        this.handleCron().then(() => {});
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCron() {
        const clientIdTwitch = this.configService.get('TWITCH_CLIENT_ID');
        const clientSecretTwitch = this.configService.get('TWITCH_CLIENT_SECRET');
        const grantType = 'client_credentials';

        let provider = await this.providerAuthenticationRepository.findByName('twitch');

        if(!provider) {
            provider = new ProviderAuthentication();
            provider.name = 'twitch';
            provider = await this.providerAuthenticationRepository.create(provider);
        }

        const response = this.httpService.post('https://id.twitch.tv/oauth2/token', null, {
            params: {
                client_id: clientIdTwitch,
                client_secret: clientSecretTwitch,
                grant_type: grantType
            },
        })

        response.subscribe({
            next: async ({data}) => {
                const now = new Date();
                now.setTime(now.getTime() + data.expires_in * 1000);

                provider.accessToken = data.access_token;
                provider.scope = 'client_credentials';
                provider.tokenExpiry = data.expires_in;
                provider.dateExpiry = now;

                await this.providerAuthenticationRepository.update(provider.id, provider);
            },
            error: (error) => {
                console.log(error);
            }
        })
    }


    async validateInLive(name: string) {
        let provider = await this.providerAuthenticationRepository.findByName('twitch');
        const clientIdTwitch = this.configService.get('TWITCH_CLIENT_ID');
        
        const response = this.httpService.get('https://api.twitch.tv/helix/streams', {
            params: {
                user_login: name,
            },
            headers: {
                'Authorization': `Bearer ${provider.accessToken}`,
                'Client-Id': clientIdTwitch
            }
        })

        let dataReturned = null;

        const { data } = await firstValueFrom(response)
        const datum = data.data;

        if(datum.length > 0) {
            dataReturned = datum[0];
        }

        return dataReturned;
    }

    async validateUser(name: string) {        
        let provider = await this.providerAuthenticationRepository.findByName('twitch');
        const clientIdTwitch = this.configService.get('TWITCH_CLIENT_ID');
        
        const response = this.httpService.get('https://api.twitch.tv/helix/users', {
            params: {
                login: name,
            },
            headers: {
                'Authorization': `Bearer ${provider.accessToken}`,
                'Client-Id': clientIdTwitch
            }
        })

        let dataReturned = null;

        const { data } = await firstValueFrom(response)
        const datum = data.data;

        if(datum.length > 0) {
            dataReturned = datum[0];
        }

        return dataReturned;
    }


    async currentProviderAuth(provider: string): Promise<ProviderAuthentication> {
        return this.providerAuthenticationRepository.findByName(provider);
    }
}
