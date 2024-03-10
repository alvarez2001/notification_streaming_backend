import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { StreamingNotification } from '../../domain/entity/streamingnotification.entity';
import { appEvents } from '@shared/infrastructure/messaging/event-emitter';
import { DeclarationQueues } from '@shared/infrastructure/messaging/rabbitmq/declaration-queues';

@EventSubscriber()
export class StreamingNotificationSubscriber implements EntitySubscriberInterface<StreamingNotification> {
  listenTo() {
    return StreamingNotification;
  }

  afterInsert(event: InsertEvent<StreamingNotification>): void {
    appEvents.emit(DeclarationQueues.streamingnotification_created, event.entity);
  }

  afterUpdate(event: UpdateEvent<StreamingNotification>): void {
    appEvents.emit(DeclarationQueues.streamingnotification_updated, event.entity);
  }
}
