import { DeclarationExchanges } from './declaration-exchanges';
import { DeclarationQueues } from './declaration-queues';

export const ExchangesAndQueues: {
    [exchange: string]: string[];
} = {
    [DeclarationExchanges.user_exchange]: [
        DeclarationQueues.user_created,
        DeclarationQueues.user_updated,
    ],
    [DeclarationExchanges.authentication_exchange]: [
        DeclarationQueues.authentication_created,
        DeclarationQueues.authentication_updated,
    ],
    [DeclarationExchanges.oauth2credential_exchange]: [
        DeclarationQueues.oauth2credential_created,
        DeclarationQueues.oauth2credential_updated,
    ],
    [DeclarationExchanges.streamingnotification_exchange]: [
        DeclarationQueues.streamingnotification_created,
        DeclarationQueues.streamingnotification_updated,
    ],
};
