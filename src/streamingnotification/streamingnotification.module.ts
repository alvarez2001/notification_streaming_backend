import { Module, forwardRef } from '@nestjs/common';
import { RabbitmqModule } from '@shared/infrastructure/messaging/rabbitmq/rabbitmq.module';
import { StreamingNotificationCreatedConsumer } from './application/consumers/streamingnotificationCreated.consumer';
import { StreamingNotificationCreatedPublisher } from './application/publishers/streamingnotificationCreated.publisher';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreamingNotification } from './domain/entity/streamingnotification.entity';
import { StreamingNotificationRepository } from './infrastructure/repository/streamingnotification.repository';
import { StreamingNotificationController } from './interfaces/api/streamingnotification.controller';
import { StreamingNotificationService } from './application/streamingnotification.service';
import { STREAMINGNOTIFICATION_REPOSITORY_INTERFACE } from './domain/interfaces/streamingnotificationRepository.interface';
import { StreamingNotificationSubscriber } from './application/subscriber/streamingnotification.subscriber';
import { StreamingNotificationUpdatedConsumer } from './application/consumers/streamingnotificationUpdated.consumer';
import { StreamingNotificationUpdatedPublisher } from './application/publishers/streamingnotificationUpdated.publisher';
import { ProviderAuthentication } from './domain/entity/providerauthentication.entity';
import { ProviderAuthenticationService } from './application/providerauthentication.service';
import { PROVIDER_AUTHENTICATION_REPOSITORY_INTERFACE } from './domain/interfaces/providerauthenticationRepository.interface';
import { ProviderAuthenticationRepository } from './infrastructure/repository/providerauthentication.repository';
import { HttpModule } from '@nestjs/axios';
import { Oauth2credentialModule } from 'src/oauth2credential/oauth2credential.module';

@Module({
    controllers: [StreamingNotificationController],
    exports: [StreamingNotificationService],
    imports: [
        RabbitmqModule,
        HttpModule,
        TypeOrmModule.forFeature([StreamingNotification, ProviderAuthentication]),
        forwardRef(() => Oauth2credentialModule),
    ],
    providers: [
        {
            provide: STREAMINGNOTIFICATION_REPOSITORY_INTERFACE,
            useClass: StreamingNotificationRepository,
        },
        {
            provide: PROVIDER_AUTHENTICATION_REPOSITORY_INTERFACE,
            useClass: ProviderAuthenticationRepository,
        },
        StreamingNotificationCreatedConsumer,
        StreamingNotificationCreatedPublisher,
        StreamingNotificationUpdatedConsumer,
        StreamingNotificationUpdatedPublisher,
        StreamingNotificationService,
        StreamingNotificationSubscriber,
        ProviderAuthenticationService,
    ],
})
export class StreamingNotificationModule {}
