import { AuthService } from './../auth/auth.service';
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
import { ChatBot, ChatService } from './chat.service';
import { InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { ResumePipe } from '../resume/resume.pipe';
import {
  ChatMessage,
  ClientToServerEvents,
  ServerToClientEvents,
  StartChatData,
  WebsocketEvents
} from '@resume-optimizer/shared/socket-constants';
import { getConversationMessages } from 'src/utils/chatbot-utils';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly resumePipe: ResumePipe,
    private readonly authService: AuthService
  ) {}

  @WebSocketServer()
  private server: Server<ClientToServerEvents, ServerToClientEvents>;

  private readonly logger = new Logger(ChatGateway.name);
  private chatBots: Record<string, ChatBot> = {};
  private connectedUsers: Set<string> = new Set<string>();

  async handleConnection(client: Socket<ClientToServerEvents, ServerToClientEvents>): Promise<void> {
    try {
      this.logger.log(`Client connected: ${client.id}`);
      const token = client.handshake.headers.authorization?.split(' ')[1];
      const userId = (await this.authService.verifyToken(token ?? ''))?.uid;
      if (!userId) throw new UnauthorizedException();
      if (this.connectedUsers.has(userId)) throw new UnauthorizedException('user only allowed one active session');
      this.connectedUsers.add(userId);
      const existingConversation = await this.chatService.getActiveConversation(userId);
      if (existingConversation) {
        const { baseResume, updatedResumeText, jobDescription } = existingConversation;
        this.chatBots[client.id] = await this.chatService.getChatbot({
          resume: baseResume,
          websocket: client,
          conversation: existingConversation
        });
        client.emit(WebsocketEvents.Chat.MessageHistory, getConversationMessages(existingConversation));
        client.emit(WebsocketEvents.Resume.Update, updatedResumeText);
        client.emit(WebsocketEvents.JobDescription.ProcessingComplete, jobDescription);
      } else {
        client.emit(WebsocketEvents.Chat.NoActiveConversationFound);
      }
    } catch (error: any) {
      client.emit(WebsocketEvents.Error.Error, error.message);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket<ClientToServerEvents, ServerToClientEvents>): Promise<void> {
    try {
      this.logger.log(`Client disconnected: ${client.id}`);
      const token = client.handshake.headers.authorization?.split(' ')[1];
      const userId = (await this.authService.verifyToken(token ?? ''))?.uid;
      if (userId) this.connectedUsers.delete(userId);
      delete this.chatBots[client.id];
    } catch (error: any) {
      client.emit(WebsocketEvents.Error.Error, error.message);
      client.disconnect();
    }
  }

  @SubscribeMessage(WebsocketEvents.Chat.StartChat)
  async handleNewChat(
    @MessageBody() data: StartChatData,
    @ConnectedSocket() client: Socket<ClientToServerEvents, ServerToClientEvents>
  ): Promise<void> {
    try {
      const { resumeId, jobUrl } = data;
      const resume = await this.resumePipe.transform(resumeId);
      this.chatBots[client.id] = await this.chatService.getChatbot({
        resume,
        jobUrl,
        websocket: client
      });
    } catch (error: any) {
      client.emit(WebsocketEvents.Error.Error, error.message);
      client.disconnect();
    }
  }

  @SubscribeMessage(WebsocketEvents.Chat.UserMessage)
  async handleMessage(
    @MessageBody() data: ChatMessage,
    @ConnectedSocket() client: Socket<ClientToServerEvents, ServerToClientEvents>
  ): Promise<void> {
    try {
      const { content } = data;
      const res = await this.chatBots[client.id].invoke(content);
      if (!res) throw new InternalServerErrorException();
      client.emit(WebsocketEvents.Chat.ChatBotMessage, { messageType: 'ai', content: res?.toString() });
    } catch (error: any) {
      client.emit(WebsocketEvents.Error.Error, error.message);
      client.disconnect();
    }
  }

  @SubscribeMessage(WebsocketEvents.Chat.Close)
  async handleClose(@ConnectedSocket() client: Socket<ClientToServerEvents, ServerToClientEvents>) {
    try {
      const { conversationId } = this.chatBots[client.id];
      await this.chatService.deactivateConversation(conversationId);
      client.emit(WebsocketEvents.Chat.ConversationDeactivated, { conversationId });
      client.disconnect();
    } catch (error: any) {
      client.emit(WebsocketEvents.Error.Error, error.message);
      client.disconnect();
    }
  }
}
