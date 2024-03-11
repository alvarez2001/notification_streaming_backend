import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import {
    STREAMINGNOTIFICATION_REPOSITORY_INTERFACE,
    StreamingNotificationRepositoryInterface,
} from '../domain/interfaces/streamingnotificationRepository.interface';
import { StreamingNotification } from '../domain/entity/streamingnotification.entity';
import { CreateStreamingNotificationDto } from '../interfaces/api/dto/create-streamingnotification.dto';
import { UpdateStreamingNotificationDto } from '../interfaces/api/dto/update-streamingnotification.dto';
import { StreamingNotificationResponseDto } from '../interfaces/api/dto/streamingnotification-response.dto';
import { plainToClass } from 'class-transformer';
import { SearchCriteriaDto } from '@shared/interfaces/search-criteria.dto';
import { PaginateResponseDto } from '@shared/interfaces/paginate-response.dto';
import { ProviderAuthenticationService } from './providerauthentication.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Oauth2credentialService } from 'src/oauth2credential/application/oauth2credential.service';
import { Oauth2credential } from 'src/oauth2credential/domain/entity/oauth2credential.entity';
import { EventsGateway, TypeMessagesSocket } from 'src/gateway/events/events.gateway';
const crypto = require('crypto');

@Injectable()
export class StreamingNotificationService {
    constructor(
        @Inject(STREAMINGNOTIFICATION_REPOSITORY_INTERFACE)
        private streamingnotificationRepository: StreamingNotificationRepositoryInterface,
        private providerAuthenticationService: ProviderAuthenticationService,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @Inject(forwardRef(() => Oauth2credentialService))
        private oauth2CredentialService: Oauth2credentialService,
        @Inject(forwardRef(() => EventsGateway))
        private eventsGateway: EventsGateway,
    ) {}

    async createStreamingNotification(
        createStreamingNotificationDto: CreateStreamingNotificationDto,
        userId: number,
    ): Promise<StreamingNotificationResponseDto> {
        const name = createStreamingNotificationDto.name;
        const valideUserPlatform = await this.providerAuthenticationService.validateUser(name);

        if (!valideUserPlatform) {
            throw new NotFoundException(
                `User ${name} no exist in platform ${createStreamingNotificationDto.platformStreaming}`,
            );
        }

        const streamingnotification = new StreamingNotification();
        Object.assign(streamingnotification, createStreamingNotificationDto, {
            userId,
            broadcasterUserId: valideUserPlatform.id,
            profileImageUrl: valideUserPlatform.profile_image_url,
        });
        await this.streamingnotificationRepository.create(streamingnotification);
        return plainToClass(StreamingNotificationResponseDto, streamingnotification, {
            excludeExtraneousValues: true,
        });
    }

    async updateStreamingNotification(
        id: number,
        updateStreamingNotificationDto: UpdateStreamingNotificationDto,
        userId: number,
    ): Promise<StreamingNotificationResponseDto> {
        const streamingnotification = await this.streamingnotificationRepository.findById(id);
        if (!streamingnotification) {
            throw new NotFoundException('StreamingNotification not found');
        }

        if (streamingnotification.userId !== userId) {
            throw new NotFoundException('StreamingNotification not found');
        }

        Object.assign(streamingnotification, updateStreamingNotificationDto);

        await this.streamingnotificationRepository.update(id, streamingnotification);
        return plainToClass(StreamingNotificationResponseDto, streamingnotification, {
            excludeExtraneousValues: true,
        });
    }

    async findStreamingNotificationById(id: number): Promise<StreamingNotificationResponseDto> {
        const streamingnotification = await this.streamingnotificationRepository.findById(id);

        return plainToClass(StreamingNotificationResponseDto, streamingnotification, {
            excludeExtraneousValues: true,
        });
    }

    async findAllStreamingNotifications(
        userId: number,
    ): Promise<StreamingNotificationResponseDto[]> {
        const streamingnotifications = await this.streamingnotificationRepository.findAll(userId);
        return streamingnotifications.map(streamingnotification =>
            plainToClass(StreamingNotificationResponseDto, streamingnotification, {
                excludeExtraneousValues: true,
            }),
        );
    }

    async deleteStreamingNotification(id: number, userId: number): Promise<void> {
        const streamingnotification = await this.streamingnotificationRepository.findById(id);
        if (!streamingnotification) {
            throw new NotFoundException('StreamingNotification not found');
        }

        if (streamingnotification.userId !== userId) {
            throw new NotFoundException('StreamingNotification not found');
        }

        const currentProviderTwitch =
            await this.providerAuthenticationService.currentProviderAuth('twitch');

        const response = this.httpService.delete(
            'https://api.twitch.tv/helix/eventsub/subscriptions',
            {
                params: {
                    id: streamingnotification.subscriptionId,
                },
                headers: {
                    'Client-Id': this.configService.get('TWITCH_CLIENT_ID'),
                    Authorization: `Bearer ${currentProviderTwitch.accessToken}`,
                },
            },
        );

        response.subscribe({
            next: () => {},
            error: err => {
                console.log(err);
            },
        });

        return this.streamingnotificationRepository.delete(id);
    }

    async pagination(
        criteria: SearchCriteriaDto,
    ): Promise<PaginateResponseDto<StreamingNotificationResponseDto>> {
        const pagination: PaginateResponseDto<StreamingNotification> =
            await this.streamingnotificationRepository.pagination(criteria);

        const paginationResponse: PaginateResponseDto<StreamingNotificationResponseDto> = {
            ...pagination,
            data: [],
        };

        paginationResponse.data = pagination.data.map(
            (streamingnotification: StreamingNotification) => {
                return plainToClass(StreamingNotificationResponseDto, streamingnotification, {
                    excludeExtraneousValues: true,
                });
            },
        );

        return paginationResponse;
    }

    async registerEventsubTwitch(dataModel: StreamingNotification) {
        const currentProviderTwitch =
            await this.providerAuthenticationService.currentProviderAuth('twitch');

        const subscriptSecret = this.getSecretCodeSubscription();
        const urlApp = this.configService.get('URL_APP');

        const sendSubscription = {
            type: 'stream.online',
            version: '1',
            condition: {
                broadcaster_user_id: dataModel.broadcasterUserId,
            },
            transport: {
                method: 'webhook',
                callback: `${urlApp}/api/streamingnotifications/webhook/twitch`,
                secret: subscriptSecret,
            },
        };
        const response = this.httpService.post(
            'https://api.twitch.tv/helix/eventsub/subscriptions',
            sendSubscription,
            {
                headers: {
                    'Client-Id': this.configService.get('TWITCH_CLIENT_ID'),
                    Authorization: `Bearer ${currentProviderTwitch.accessToken}`,
                },
            },
        );

        response.subscribe({
            next: async ({ data }) => {
                const datum = data.data[0];
                const subscriptionId = datum.id;

                await this.streamingnotificationRepository.update(dataModel.id, { subscriptionId });
            },
            error: error => {
                console.log(error);
            },
        });
    }

    async callbackWebhookTwitchNotification(
        request: Request,
        body: any,
    ): Promise<{ code: number; data: string | null }> {
        const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase();
        const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();

        const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification';
        const MESSAGE_TYPE_NOTIFICATION = 'notification';
        const MESSAGE_TYPE_REVOCATION = 'revocation';

        const HMAC_PREFIX = 'sha256=';

        let httpResponse = 204;
        let httpResponseData = null;

        let secret = this.getSecretCodeSubscription();
        let message = this.getHmacMessage(request);
        let hmac = HMAC_PREFIX + this.getHmac(secret, message);

        if (true === this.verifyMessage(hmac, request.headers[TWITCH_MESSAGE_SIGNATURE])) {
            let notification = body;
            if (MESSAGE_TYPE_NOTIFICATION === request.headers[MESSAGE_TYPE]) {
                if (notification.subscription.type == 'stream.online') {
                    const userLogin = notification.event.broadcaster_user_login;
                    await this.sendNotification(userLogin);
                    //   sendTweetLiveStream(userLogin).then(data => {});
                }

                httpResponse = 204;
            } else if (MESSAGE_TYPE_VERIFICATION === request.headers[MESSAGE_TYPE]) {
                httpResponse = 200;
                httpResponseData = notification.challenge;

                const subscriptionId = notification.subscription.id;
                const modelData =
                    await this.streamingnotificationRepository.findBySubscriptionId(subscriptionId);

                const streamingNotificationData = await this.streamingnotificationRepository.update(
                    modelData.id,
                    { status: 'filled' },
                );
                const dataStreamingNotificationDto = plainToClass(StreamingNotificationResponseDto, streamingNotificationData, {
                    excludeExtraneousValues: true,
                });

                this.eventsGateway.sendMessageUser(
                    modelData.userId,
                    TypeMessagesSocket.UPDATE_STREAMING_NOTIFICATION,
                    dataStreamingNotificationDto,
                );
            } else if (MESSAGE_TYPE_REVOCATION === request.headers[MESSAGE_TYPE]) {
                httpResponse = 204;

                console.log(`${notification.subscription.type} notifications revoked!`);
                console.log(`reason: ${notification.subscription.status}`);
                console.log(
                    `condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`,
                );
            } else {
                httpResponse = 204;
                console.log(`Unknown message type: ${request.headers[MESSAGE_TYPE]}`);
            }
        } else {
            httpResponse = 403;
        }

        return { code: httpResponse, data: httpResponseData };
    }

    private async sendNotification(userLogin: string) {
        const valideUserLivePlatform =
            await this.providerAuthenticationService.validateInLive(userLogin);

        const title = valideUserLivePlatform?.title;
        const thumbnailUrl = valideUserLivePlatform?.thumbnail_url;
        const streamingNotificationByName =
            await this.streamingnotificationRepository.findByUsername(userLogin);

        const userId = streamingNotificationByName.userId;
        const notifications = streamingNotificationByName.platformNotifications;

        const textNotification = streamingNotificationByName.message.replace('%title%', title);

        let urlPlatform = '';

        if (streamingNotificationByName.platformStreaming === 'twitch') {
            urlPlatform = `https://twitch.tv/${streamingNotificationByName.name}`;
        }

        this.eventsGateway.sendMessageGlobal(TypeMessagesSocket.NOTIFY_LIVE_STREAM, {
            platform: streamingNotificationByName.platformStreaming,
            profileImageUrl: streamingNotificationByName.profileImageUrl,
            name: streamingNotificationByName.name,
            url: urlPlatform,
        });

        for (let index = 0; index < notifications.length; index++) {
            const notification: Oauth2credential = notifications[index];

            if (notification.platform == 'twitter') {
                const tokenAccess =
                    await this.oauth2CredentialService.implementationTwitterOAuthRefreshToken(
                        userId,
                    );

                const tweetResponse = this.httpService.post(
                    'https://api.twitter.com/2/tweets',
                    { text: textNotification },
                    {
                        headers: {
                            Authorization: `Bearer ${tokenAccess}`,
                            'Content-Type': 'application/json',
                        },
                    },
                );

                tweetResponse.subscribe({
                    next: data => {
                        // console.log(data);
                    },
                    error: error => {
                        console.log(` error in send tweet ${error}`);
                    },
                });
            }
        }
    }

    private getSecretCodeSubscription(): string {
        return this.configService.get('TWITCH_SUBSCRIPTION_SECRET');
    }

    private getHmacMessage(request: any) {
        const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
        const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();

        return (
            request.headers[TWITCH_MESSAGE_ID] +
            request.headers[TWITCH_MESSAGE_TIMESTAMP] +
            JSON.stringify(request.body)
        );
    }

    private getHmac(secret, message) {
        return crypto.createHmac('sha256', secret).update(message).digest('hex');
    }

    private verifyMessage(hmac, verifySignature) {
        return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
    }
}
