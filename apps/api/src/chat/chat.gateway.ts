import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const token = client.handshake.auth.token as string | undefined;
    if (!token) {
      // Disconnect if no token
      client.disconnect();
      return;
    }
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message:send')
  handleSendMessage(
    @MessageBody()
    data: { threadId: string; content: string; mediaUrl?: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.server.emit('message:receive', {
      threadId: data.threadId,
      content: data.content,
      mediaUrl: data.mediaUrl,
      senderId: client.id,
      createdAt: new Date().toISOString(),
    });
  }

  @SubscribeMessage('typing:start')
  handleTypingStart(
    @MessageBody() data: { threadId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.emit('typing:status', {
      threadId: data.threadId,
      userId: client.id,
      isTyping: true,
    });
  }

  @SubscribeMessage('typing:stop')
  handleTypingStop(
    @MessageBody() data: { threadId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.emit('typing:status', {
      threadId: data.threadId,
      userId: client.id,
      isTyping: false,
    });
  }
}
