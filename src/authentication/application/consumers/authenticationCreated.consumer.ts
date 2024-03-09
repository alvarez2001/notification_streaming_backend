import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '@shared/infrastructure/messaging/rabbitmq/rabbitmq.service';
import { ConsumeMessage } from 'amqplib';
import { DeclarationQueues } from '@shared/infrastructure/messaging/rabbitmq/declaration-queues';

@Injectable()
export class AuthenticationCreatedConsumer implements OnModuleInit {
    constructor(private readonly rabbitMQService: RabbitMQService) {}

    async onModuleInit(): Promise<void> {
        await this.rabbitMQService.consume(
            DeclarationQueues.authentication_created,
            this.handleMessage.bind(this),
        );
    }

    private async handleMessage(msg: ConsumeMessage | null): Promise<void> {
        try {
            const data = JSON.parse(JSON.parse(msg?.content?.toString()));

            if (
                Object.prototype.hasOwnProperty.call(
                    data.displayNames,
                    DeclarationQueues.authentication_created,
                ) &&
                data.displayNames[DeclarationQueues.authentication_created] ===
                    AuthenticationCreatedConsumer.name
            ) {
            }

            this.rabbitMQService.ack(msg);
        } catch (error) {
            console.error('Error processing message:', error);
            this.rabbitMQService.nack(msg);
        }
    }
}
