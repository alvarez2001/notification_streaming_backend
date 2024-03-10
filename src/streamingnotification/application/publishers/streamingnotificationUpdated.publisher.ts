import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '@shared/infrastructure/messaging/rabbitmq/rabbitmq.service';
import { DeclarationExchanges } from '@shared/infrastructure/messaging/rabbitmq/declaration-exchanges';
import { appEvents } from '@shared/infrastructure/messaging/event-emitter';
import { DeclarationQueues } from '@shared/infrastructure/messaging/rabbitmq/declaration-queues';
import { StreamingNotification } from '../../domain/entity/streamingnotification.entity';
import { StreamingNotificationUpdatedConsumer } from '../consumers/streamingnotificationUpdated.consumer';

@Injectable()
export class StreamingNotificationUpdatedPublisher {
    constructor(private readonly rabbitMQService: RabbitMQService) {
        appEvents.on(DeclarationQueues.streamingnotification_updated, async streamingnotification => {
            await this.send(streamingnotification);
        });
    }

    async send(data: StreamingNotification): Promise<void> {
        const model = {
            data,
            writeModel: StreamingNotification.name,
            exchange: DeclarationExchanges.streamingnotification_exchange,
            displayNames: {
                [DeclarationQueues.streamingnotification_updated]: StreamingNotificationUpdatedConsumer.name,
            },
        };
        await this.rabbitMQService.publishToExchange(
            DeclarationExchanges.streamingnotification_exchange,
            JSON.stringify(model),
            { persistent: true },
        );
    }
}
