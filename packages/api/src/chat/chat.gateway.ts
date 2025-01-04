import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { IsString } from '@nestjs/class-validator';
import { plainToClass } from '@nestjs/class-transformer';
import { ChatBot, ChatService } from './chat.service';
import { Logger } from '@nestjs/common';
import { ResumePipe } from '../resume/resume.pipe';

class ChatMessageDto {
  @IsString()
  text: string;
}

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService, private readonly resumePipe: ResumePipe) {}

  @WebSocketServer()
  private server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private chatBots: Record<string, ChatBot> = {};

  async handleConnection(client: Socket): Promise<void> {
    this.logger.log(`Client connected: ${client.id}`);
    const socket = this.server.sockets.sockets.get(client.id);
    if (!socket) return;

    const { resumeId, jobUrl } = client.handshake.query;
    if (!jobUrl || !resumeId) return;
    if (typeof jobUrl !== 'string' || typeof resumeId !== 'string') return;

    const resume = await this.resumePipe.transform(resumeId);
    if (!resume) return;
    this.chatBots[client.id] = await this.chatService.getChatbot(client.id, resume, jobUrl, client);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
    delete this.chatBots[client.id];
  }

  @SubscribeMessage('chat.userMessage')
  async handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket): Promise<void> {
    const message = plainToClass(ChatMessageDto, JSON.parse(data));
    this.logger.log(message);
    const res = await this.chatBots[client.id](message.text);
    this.server.sockets.sockets.get(client.id)?.emit('chat.chatBotMessage', { response: res });
  }
}
