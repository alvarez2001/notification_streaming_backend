module.exports = (
    entityNameLowerCase,
    entityNameCamelCase,
) => `import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '@shared/infrastructure/messaging/rabbitmq/rabbitmq.service';
import { DeclarationExchanges } from '@shared/infrastructure/messaging/rabbitmq/declaration-exchanges';
import { appEvents } from '@shared/infrastructure/messaging/event-emitter';
import { DeclarationQueues } from '@shared/infrastructure/messaging/rabbitmq/declaration-queues';
import { ${entityNameCamelCase} } from '../../domain/entity/${entityNameLowerCase}.entity';
import { ${entityNameCamelCase}CreatedConsumer } from '../consumers/${entityNameLowerCase}Created.consumer';

@Injectable()
export class ${entityNameCamelCase}CreatedPublisher {
    constructor(private readonly rabbitMQService: RabbitMQService) {
        appEvents.on(DeclarationQueues.${entityNameLowerCase}_created, async ${entityNameLowerCase} => {
            await this.send(${entityNameLowerCase});
        });
    }

    async send(data: ${entityNameCamelCase}): Promise<void> {
        const model = {
            data,
            writeModel: ${entityNameCamelCase}.name,
            exchange: DeclarationExchanges.${entityNameLowerCase}_exchange,
            displayNames: {
                [DeclarationQueues.${entityNameLowerCase}_created]: ${entityNameCamelCase}CreatedConsumer.name,
            },
        };
        await this.rabbitMQService.publishToExchange(
            DeclarationExchanges.${entityNameLowerCase}_exchange,
            JSON.stringify(model),
            { persistent: true },
        );
    }
}
`;
