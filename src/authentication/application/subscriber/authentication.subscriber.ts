import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { Authentication } from '../../domain/entity/authentication.entity';
import { appEvents } from '@shared/infrastructure/messaging/event-emitter';
import { DeclarationQueues } from '@shared/infrastructure/messaging/rabbitmq/declaration-queues';

@EventSubscriber()
export class AuthenticationSubscriber implements EntitySubscriberInterface<Authentication> {
    listenTo(): typeof Authentication {
        return Authentication;
    }

    afterInsert(event: InsertEvent<Authentication>): void {
        appEvents.emit(DeclarationQueues.authentication_created, event.entity);
    }

    afterUpdate(event: UpdateEvent<Authentication>): void {
        appEvents.emit(DeclarationQueues.authentication_updated, event.entity);
    }
}
