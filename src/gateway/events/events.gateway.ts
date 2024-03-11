import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export enum TypeMessagesSocket {
    AUTH = 'AUTH',
    UPDATE_OAUTH2 = 'UPDATE_OAUTH2',
    UPDATE_STREAMING_NOTIFICATION = 'UPDATE_STREAMING_NOTIFICATION',
    NOTIFY_LIVE_STREAM = 'NOTIFY_LIVE_STREAM',
}

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private server: Server;

    private clients = new Map<number, string>();

    async handleConnection(client: Socket) {}

    @SubscribeMessage('register')
    handleRegister(client: Socket, payload: { userId: number }): void {
        this.clients.set(payload.userId, client.id);
    }

    async handleDisconnect(client: Socket) {
        const entry = [...this.clients.entries()].find(
            ([userId, socketId]) => socketId === client.id,
        );
        if (entry) {
            this.clients.delete(entry[0]);
        }
    }

    findClientIdByUserId(userId: number): string | undefined {
        return this.clients.get(userId);
    }

    private findClientById(clientId: string): Socket | undefined {
        return this.server.sockets.sockets.get(clientId);
    }

    sendMessageUser(userId: number, type: string, message: any): void {
        const clientId = this.findClientIdByUserId(userId);

        if (clientId) {
            const clientSocket = this.findClientById(clientId);
            if (clientSocket) {
                clientSocket.emit(type, message);
            } else {
                console.log(`Socket no encontrado para el cliente con ID: ${clientId}`);
            }
        } else {
            console.log(`No se encontró el ID del cliente para el usuario: ${userId}`);
        }
    }

    sendMessageGlobal(type: string, message: any) {
        this.server.emit(type, message);
    }
}
