module.exports = (entityNameLowerCase, entityNameCamelCase) => `import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { ${entityNameCamelCase} } from '../../domain/entity/${entityNameLowerCase}.entity';
import { appEvents } from '@shared/infrastructure/messaging/event-emitter';
import { DeclarationQueues } from '@shared/infrastructure/messaging/rabbitmq/declaration-queues';

@EventSubscriber()
export class ${entityNameCamelCase}Subscriber implements EntitySubscriberInterface<${entityNameCamelCase}> {
  listenTo() {
    return ${entityNameCamelCase};
  }

  afterInsert(event: InsertEvent<${entityNameCamelCase}>): void {
    appEvents.emit(DeclarationQueues.${entityNameLowerCase}_created, event.entity);
  }

  afterUpdate(event: UpdateEvent<${entityNameCamelCase}>): void {
    appEvents.emit(DeclarationQueues.${entityNameLowerCase}_updated, event.entity);
  }
}
`;
