import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Oauth2credential } from '../../domain/entity/oauth2credential.entity';
import { appEvents } from '@shared/infrastructure/messaging/event-emitter';
import { DeclarationQueues } from '@shared/infrastructure/messaging/rabbitmq/declaration-queues';

@EventSubscriber()
export class Oauth2credentialSubscriber implements EntitySubscriberInterface<Oauth2credential> {
  listenTo() {
    return Oauth2credential;
  }

  afterInsert(event: InsertEvent<Oauth2credential>): void {
    appEvents.emit(DeclarationQueues.oauth2credential_created, event.entity);
  }

  afterUpdate(event: UpdateEvent<Oauth2credential>): void {
    appEvents.emit(DeclarationQueues.oauth2credential_updated, event.entity);
  }
}
