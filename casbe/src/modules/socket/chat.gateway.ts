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
import { MessageService } from '../message/message.service';
import { CreateMessageDto } from '../message/dto/create-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinCaseRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { caseId: number; userId: number },
  ) {
    const room = `case_${payload.caseId}`;
    client.join(room);
    console.log(`User ${payload.userId} joined room ${room}`);
  }

  @SubscribeMessage('leaveCaseRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { caseId: number; userId: number },
  ) {
    const room = `case_${payload.caseId}`;
    client.leave(room);
    console.log(`User ${payload.userId} left room ${room}`);
  }

  @SubscribeMessage('sendMessageToCase')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: {
      createMessageDto: CreateMessageDto;
      currentUser: any;
    },
  ) {
    try {
      // Create message via the service (which validates the user, though we bypass strict entity type here with `any`)
      const message = await this.messageService.create(
        payload.createMessageDto,
        payload.currentUser,
      );

      // Emit to everyone in the room (including sender)
      const room = `case_${payload.createMessageDto.caseId}`;
      this.server.to(room).emit('newMessage', message);
    } catch (error) {
      console.error('Failed to send message via socket:', error);
      client.emit('errorMessage', { message: error.message });
    }
  }
}
