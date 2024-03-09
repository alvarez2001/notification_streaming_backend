import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { connect, AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { Channel, ConsumeMessage } from 'amqplib';
import { ExchangesAndQueues } from './exchange-and-queues';
import { ConfigService } from '@nestjs/config';
import { PublishOptions } from 'amqp-connection-manager/dist/types/ChannelWrapper';

@Injectable()
export class RabbitMQService implements OnModuleDestroy {
    private readonly connectionManager: AmqpConnectionManager;
    private channelWrapper: ChannelWrapper;

    constructor(configService: ConfigService) {
        this.connectionManager = connect(
            [
                `amqp://${configService.get<string>('RABBITMQ_USERNAME')}:${configService.get<string>('RABBITMQ_PASSWORD')}@${configService.get<string>('RABBITMQ_HOST')}/${configService.get<string>('RABBITMQ_VHOST')}`,
            ],
            {
                heartbeatIntervalInSeconds: 5,
            },
        );

        this.channelWrapper = this.connectionManager.createChannel({
            json: true,
            setup: async () => {},
        });
    }

    async setupFanoutExchanges(): Promise<void> {
        const exchangesWithQueues = ExchangesAndQueues;
        return this.channelWrapper.addSetup(async (channel: Channel) => {
            for (const [exchange, queues] of Object.entries(exchangesWithQueues)) {
                try {
                    await channel.assertExchange(exchange, 'fanout', {
                        durable: true,
                    });
                    for (const queue of queues) {
                        await channel.assertQueue(queue, { durable: true });
                        await channel.bindQueue(queue, exchange, '');
                    }
                } catch (error) {
                    console.error(
                        `Error configuring exchange ${exchange} and queues ${queues}:`,
                        error,
                    );
                }
            }
        });
    }

    /**
     * Publish a message to a specific exchange.
     * @param {string} exchange The name of the exchange to publish the message to.
     * @param {string} message The message to publish.
     * @param {Object} [options={}] Publishing options.
     */
    async publishToExchange(
        exchange: string,
        message: string,
        options: object = {},
    ): Promise<boolean> {
        return this.channelWrapper.publish(exchange, '', message, options);
    }

    /**
     * Consume messages from a specific queue.
     * @param {string} queue The name of the queue to consume messages from.
     * @param {(msg: ConsumeMessage) => void} onMessage The callback that handles the messages.
     */
    async consume(queue: string, onMessage: () => void): Promise<void> {
        await this.channelWrapper.waitForConnect(async err => {
            if (err) {
                return;
            }
            await this.setupFanoutExchanges();
            await this.channelWrapper.addSetup(async (channel: Channel) => {
                return channel.consume(queue, onMessage, { noAck: false });
            });
        });
    }

    /**
     * Send a message to a specific queue.
     * @param {string} queue The name of the queue to which to send the message.
     * @param {string} message The message to send.
     * @param {PublishOptions} [options] Publishing options.
     */
    async send(queue: string, message: string, options?: PublishOptions): Promise<boolean> {
        return this.channelWrapper.sendToQueue(queue, message, options);
    }

    /**
     * Send an acknowledgment (ack) to the message to indicate that it has been processed correctly.
     * @param {ConsumeMessage} msg The message to confirm.
     */
    ack(msg: ConsumeMessage): void {
        this.channelWrapper.ack(msg);
    }

    /**
     * Send a negative acknowledgment (nack) to the message to indicate that it has not been processed correctly.
     * @param {ConsumeMessage} msg The message to reject.
     */
    nack(msg: ConsumeMessage): void {
        this.channelWrapper.nack(msg);
    }

    /**
     * Close the connection with RabbitMQ when the module is destroyed.
     */
    onModuleDestroy(): void {
        if (this.connectionManager) {
            this.connectionManager.close();
        }
    }
}
