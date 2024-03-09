import { Module } from '@nestjs/common';
import { RabbitmqModule } from '@shared/infrastructure/messaging/rabbitmq/rabbitmq.module';
import { UserCreatedConsumer } from './application/consumers/userCreated.consumer';
import { UserCreatedPublisher } from './application/publishers/userCreated.publisher';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entity/user.entity';
import { UserRepository } from './infrastructure/repository/user.repository';
import { UserController } from './interfaces/api/user.controller';
import { UserService } from './application/user.service';
import { USER_REPOSITORY_INTERFACE } from './domain/interfaces/userRepository.interface';
import { UserSubscriber } from './application/subscriber/user.subscriber';
import { UserUpdatedConsumer } from './application/consumers/userUpdated.consumer';
import { UserUpdatedPublisher } from './application/publishers/userUpdated.publisher';
import { Oauth2credential } from 'src/oauth2credential/domain/entity/oauth2credential.entity';

@Module({
    controllers: [UserController],
    exports: [UserService],
    imports: [RabbitmqModule, TypeOrmModule.forFeature([User])],
    providers: [
        {
            provide: USER_REPOSITORY_INTERFACE,
            useClass: UserRepository,
        },
        UserCreatedConsumer,
        UserCreatedPublisher,
        UserUpdatedConsumer,
        UserUpdatedPublisher,
        UserService,
        UserSubscriber,
    ],
})
export class UserModule {}
