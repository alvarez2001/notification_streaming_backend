import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '@shared/infrastructure/messaging/rabbitmq/rabbitmq.service';
import { DeclarationExchanges } from '@shared/infrastructure/messaging/rabbitmq/declaration-exchanges';
import { appEvents } from '@shared/infrastructure/messaging/event-emitter';
import { DeclarationQueues } from '@shared/infrastructure/messaging/rabbitmq/declaration-queues';
import { Oauth2credential } from '../../domain/entity/oauth2credential.entity';
import { Oauth2credentialUpdatedConsumer } from '../consumers/oauth2credentialUpdated.consumer';

@Injectable()
export class Oauth2credentialUpdatedPublisher {
    constructor(private readonly rabbitMQService: RabbitMQService) {
        appEvents.on(DeclarationQueues.oauth2credential_updated, async oauth2credential => {
            await this.send(oauth2credential);
        });
    }

    async send(data: Oauth2credential): Promise<void> {
        const model = {
            data,
            writeModel: Oauth2credential.name,
            exchange: DeclarationExchanges.oauth2credential_exchange,
            displayNames: {
                [DeclarationQueues.oauth2credential_updated]: Oauth2credentialUpdatedConsumer.name,
            },
        };
        await this.rabbitMQService.publishToExchange(
            DeclarationExchanges.oauth2credential_exchange,
            JSON.stringify(model),
            { persistent: true },
        );
    }
}
