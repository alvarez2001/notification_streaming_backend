import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '@shared/infrastructure/messaging/rabbitmq/rabbitmq.service';
import { DeclarationExchanges } from '@shared/infrastructure/messaging/rabbitmq/declaration-exchanges';
import { appEvents } from '@shared/infrastructure/messaging/event-emitter';
import { DeclarationQueues } from '@shared/infrastructure/messaging/rabbitmq/declaration-queues';
import { User } from '../../domain/entity/user.entity';
import { UserCreatedConsumer } from '../consumers/userCreated.consumer';

@Injectable()
export class UserCreatedPublisher {
    constructor(private readonly rabbitMQService: RabbitMQService) {
        appEvents.on(DeclarationQueues.user_created, async user => {
            await this.send(user);
        });
    }

    async send(data: User): Promise<void> {
        const model = {
            data,
            writeModel: User.name,
            exchange: DeclarationExchanges.user_exchange,
            displayNames: {
                [DeclarationQueues.user_created]: UserCreatedConsumer.name,
            },
        };
        await this.rabbitMQService.publishToExchange(
            DeclarationExchanges.user_exchange,
            JSON.stringify(model),
            { persistent: true },
        );
    }
}
