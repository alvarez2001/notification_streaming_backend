import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { User } from '../../domain/entity/user.entity';
import { appEvents } from '@shared/infrastructure/messaging/event-emitter';
import { DeclarationQueues } from '@shared/infrastructure/messaging/rabbitmq/declaration-queues';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    listenTo(): typeof User {
        return User;
    }

    afterInsert(event: InsertEvent<User>): void {
        appEvents.emit(DeclarationQueues.user_created, event.entity);
    }

    afterUpdate(event: UpdateEvent<User>): void {
        appEvents.emit(DeclarationQueues.user_updated, event.entity);
    }
}
