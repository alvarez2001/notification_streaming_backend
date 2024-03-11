import { Module, forwardRef } from '@nestjs/common';
import { RabbitmqModule } from '@shared/infrastructure/messaging/rabbitmq/rabbitmq.module';
import { Oauth2credentialCreatedConsumer } from './application/consumers/oauth2credentialCreated.consumer';
import { Oauth2credentialCreatedPublisher } from './application/publishers/oauth2credentialCreated.publisher';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Oauth2credential } from './domain/entity/oauth2credential.entity';
import { Oauth2credentialRepository } from './infrastructure/repository/oauth2credential.repository';
import { Oauth2credentialController } from './interfaces/api/oauth2credential.controller';
import { Oauth2credentialService } from './application/oauth2credential.service';
import { OAUTH2CREDENTIAL_REPOSITORY_INTERFACE } from './domain/interfaces/oauth2credentialRepository.interface';
import { Oauth2credentialSubscriber } from './application/subscriber/oauth2credential.subscriber';
import { Oauth2credentialUpdatedConsumer } from './application/consumers/oauth2credentialUpdated.consumer';
import { Oauth2credentialUpdatedPublisher } from './application/publishers/oauth2credentialUpdated.publisher';
import { HttpModule } from '@nestjs/axios';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
    controllers: [Oauth2credentialController],
    exports: [Oauth2credentialService],
    imports: [
        RabbitmqModule,
        TypeOrmModule.forFeature([Oauth2credential]),
        HttpModule,
        forwardRef(() => GatewayModule),
    ],
    providers: [
        {
            provide: OAUTH2CREDENTIAL_REPOSITORY_INTERFACE,
            useClass: Oauth2credentialRepository,
        },
        Oauth2credentialCreatedConsumer,
        Oauth2credentialCreatedPublisher,
        Oauth2credentialUpdatedConsumer,
        Oauth2credentialUpdatedPublisher,
        Oauth2credentialService,
        Oauth2credentialSubscriber,
    ],
})
export class Oauth2credentialModule {}
