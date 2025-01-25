import { Args, Query, Resolver } from '@nestjs/graphql';
import { Conversation } from './chat.model';
import { InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Context } from 'src/context/context.service';
import { ChatService } from './chat.service';

@UseGuards(AuthGuard)
@Resolver(() => Conversation)
export class ChatResolver {
  constructor(private readonly chatService: ChatService, private readonly context: Context) {}

  @Query(() => [Conversation])
  async getAllConversations(): Promise<Conversation[]> {
    const user = this.context.get('user');
    if (!user) throw new InternalServerErrorException();
    const conversations = await this.chatService.getAllConversations(user._id);
    if (!conversations) throw new NotFoundException();
    return conversations;
  }

  @Query(() => Conversation)
  async getConversationById(
    @Args('conversationId', { type: () => String }) conversationId: string
  ): Promise<Conversation> {
    const conversation = await this.chatService.getConversationById(conversationId);
    if (!conversation) throw new NotFoundException();
    return conversation;
  }
}
