import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '@shared/infrastructure/messaging/rabbitmq/rabbitmq.service';
import { ConsumeMessage } from 'amqplib';
import { DeclarationQueues } from '@shared/infrastructure/messaging/rabbitmq/declaration-queues';

@Injectable()
export class Oauth2credentialUpdatedConsumer implements OnModuleInit {
    constructor(private readonly rabbitMQService: RabbitMQService) {}

    async onModuleInit(): Promise<void> {
        await this.rabbitMQService.consume(
            DeclarationQueues.oauth2credential_updated,
            this.handleMessage.bind(this),
        );
    }

    private async handleMessage(msg: ConsumeMessage): Promise<void> {
        try {
            const data = JSON.parse(JSON.parse(msg?.content?.toString()));

            if (
                Object.prototype.hasOwnProperty.call(
                    data.displayNames,
                    DeclarationQueues.oauth2credential_updated,
                ) &&
                data.displayNames[DeclarationQueues.oauth2credential_updated] === Oauth2credentialUpdatedConsumer.name
            ) {
            }

            this.rabbitMQService.ack(msg);
        } catch (error) {
            console.error('Error procesando el mensaje:', error);
            this.rabbitMQService.nack(msg);
        }
    }
}
