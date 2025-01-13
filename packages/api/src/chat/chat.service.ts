import { getUpdatedTextContent } from '../utils/resume-utils';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { END, MemorySaver, MessagesAnnotation, START, StateGraph } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import {
  BaseMessage,
  HumanMessage,
  MessageContent,
  SystemMessage,
  mapChatMessagesToStoredMessages,
  mapStoredMessagesToChatMessages
} from '@langchain/core/messages';
import { ResumeService } from '../resume/resume.service';
import { JobDescriptionService } from '../job-description/job-description.service';
import { Resume } from '../resume/resume.model';
import { tool } from '@langchain/core/tools';
import { SendUpdateSchema } from './chat.dto';
import { Socket } from 'socket.io';
import { ToolNode, toolsCondition } from '@langchain/langgraph/prebuilt';
import { CHATBOT_SYSTEM_PROMPT } from '../constants/chatbot-constants';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  TextContent,
  WebsocketEvents
} from '@resume-optimizer/shared/socket-constants';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from './chat.model';
import { Model, Types } from 'mongoose';
import _ from 'lodash';
import { JobDescription } from 'src/job-description/job-description.model';
import { similarSubstring } from 'src/utils/similar-substring';

export type ChatBot = {
  invoke: (message: string) => Promise<MessageContent | null>;
  conversationId: string;
};

@Injectable()
export class ChatService {
  constructor(
    private readonly configService: ConfigService,
    private readonly resumeService: ResumeService,
    private readonly jobDescriptionService: JobDescriptionService,
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>
  ) {}

  private getChatApp(conversation: Conversation, websocket: Socket<ClientToServerEvents, ServerToClientEvents>) {
    let { updatedResumeText } = conversation;

    const llm = new ChatOpenAI({
      model: this.configService.get('OPENAI_CHAT_MODEL', 'gpt-3.5-turbo'),
      apiKey: this.configService.getOrThrow('OPENAI_API_KEY')
    });

    const sendUpdate = async ({ find, replace }: { find: string; replace: string }): Promise<string> => {
      const closestMatch = similarSubstring(
        updatedResumeText
          .flat()
          .map(({ content }) => content)
          .join(''),
        find
      );
      if (!closestMatch) throw new InternalServerErrorException();
      updatedResumeText = getUpdatedTextContent(updatedResumeText, { find: closestMatch.items[0], replace });
      await this.updateConversation({ conversationId: conversation._id, updatedResumeText });
      websocket.emit(WebsocketEvents.Resume.Update, updatedResumeText);
      return updatedResumeText
        .flat()
        .map(({ content }) => content)
        .join('');
    };

    const sendUpdateTool = tool(sendUpdate, {
      name: 'sendUpdate',
      description: 'updates a piece of text in a resume in find/replace format',
      responseFormat: 'content',
      schema: SendUpdateSchema
    });

    const chatAndUpdate = async (state: typeof MessagesAnnotation.State) => {
      const llmWithTools = llm.bindTools([sendUpdateTool]);
      const res = await llmWithTools.invoke(state.messages);
      return { messages: [res] };
    };

    const tools = new ToolNode([sendUpdateTool]);

    const checkpointer = new MemorySaver();

    const app = new StateGraph(MessagesAnnotation)
      .addNode('chatAndUpdate', chatAndUpdate)
      .addNode('tools', tools)
      .addEdge(START, 'chatAndUpdate')
      .addConditionalEdges('chatAndUpdate', toolsCondition, ['tools', END])
      .addEdge('tools', 'chatAndUpdate')
      .compile({ checkpointer });

    if (conversation.messages.length > 0)
      app.updateState(
        { configurable: { thread_id: conversation._id } },
        { messages: mapStoredMessagesToChatMessages(conversation.messages) }
      );

    return app;
  }

  private async getNewChatbot(
    resume: Resume,
    websocket: Socket<ClientToServerEvents, ServerToClientEvents>,
    jobUrl: string
  ): Promise<ChatBot> {
    const { textContent: resumeText } = resume;
    const jobDescription = await this.jobDescriptionService.parseJobDescription(jobUrl);
    websocket.emit(WebsocketEvents.JobDescription.ProcessingComplete);

    const conversation = await this.createConversation(resume, jobDescription);
    const threadId = conversation._id;

    const app = this.getChatApp(conversation, websocket);

    const initialMessages = [
      new SystemMessage(CHATBOT_SYSTEM_PROMPT),
      new HumanMessage({ name: 'resume', content: resumeText.join('\n') }),
      new HumanMessage({ name: 'job_description', content: JSON.stringify(_.omit(jobDescription, ['_id', 'url'])) })
    ];

    const initialRes = await app.invoke(
      {
        messages: initialMessages
      },
      { configurable: { thread_id: threadId } }
    );

    const initialResMessage = initialRes.messages.at(-1);
    if (!initialResMessage) throw new InternalServerErrorException();
    websocket.emit(WebsocketEvents.Resume.Update, conversation.updatedResumeText);
    websocket.emit(WebsocketEvents.Chat.AnalyzingComplete);

    await this.updateConversation({ conversationId: threadId, messages: [...initialMessages, initialResMessage] });
    websocket.emit(WebsocketEvents.Chat.ChatBotMessage, {
      content: initialRes.messages.at(-1)?.content.toString() ?? '',
      messageType: 'ai'
    });

    const sendAndUpdate = async (message: string) => {
      const inputMessage = new HumanMessage(message);
      const res = await app.invoke({ messages: [inputMessage] }, { configurable: { thread_id: threadId } });
      const resMessage = res.messages.at(-1);
      if (!resMessage) throw new InternalServerErrorException();
      await this.updateConversation({ conversationId: threadId, messages: [inputMessage, resMessage] });
      return resMessage.content;
    };

    return { invoke: sendAndUpdate, conversationId: threadId };
  }

  private async getExistingChatbot(
    conversation: Conversation,
    websocket: Socket<ClientToServerEvents, ServerToClientEvents>
  ): Promise<ChatBot> {
    const app = this.getChatApp(conversation, websocket);

    const sendAndUpdate = async (message: string) => {
      const inputMessage = new HumanMessage(message);
      const res = await app.invoke({ messages: [inputMessage] }, { configurable: { thread_id: conversation._id } });
      const resMessage = res.messages.at(-1);
      if (!resMessage) throw new InternalServerErrorException();
      await this.updateConversation({ conversationId: conversation._id, messages: [inputMessage, resMessage] });
      return resMessage.content;
    };

    return {
      invoke: sendAndUpdate,
      conversationId: conversation._id.toString()
    };
  }

  async getChatbot({
    resume,
    websocket,
    jobUrl,
    conversation
  }: {
    resume: Resume;
    websocket: Socket<ClientToServerEvents, ServerToClientEvents>;
    jobUrl?: string;
    conversation?: Conversation;
  }): Promise<ChatBot> {
    if (jobUrl) return this.getNewChatbot(resume, websocket, jobUrl);
    if (conversation) return this.getExistingChatbot(conversation, websocket);
    throw new InternalServerErrorException();
  }

  private async createConversation(resume: Resume, jobDescription: JobDescription): Promise<Conversation> {
    const conversation = await this.conversationModel.create({
      user: resume.user._id,
      baseResume: resume._id,
      updatedResumeText: resume.textContent.map((page) => [{ content: page, type: 'original' }]),
      jobDescription: jobDescription._id,
      messages: [],
      isActive: true
    });
    if (!conversation) throw new InternalServerErrorException();
    return conversation;
  }

  private async updateConversation({
    conversationId,
    messages,
    updatedResumeText
  }: {
    conversationId: string;
    messages?: BaseMessage[];
    updatedResumeText?: TextContent[][];
  }): Promise<void> {
    if (messages) {
      await this.conversationModel.findByIdAndUpdate(conversationId, {
        $push: { messages: { $each: mapChatMessagesToStoredMessages(messages) } }
      });
      return;
    }
    if (updatedResumeText) {
      await this.conversationModel.findByIdAndUpdate(conversationId, {
        updatedResumeText
      });
    }
  }

  async deactivateConversation(conversationId: string): Promise<void> {
    await this.conversationModel.findByIdAndUpdate(conversationId, { isActive: false });
    return;
  }

  async getActiveConversation(userId: string): Promise<Conversation | null> {
    return this.conversationModel.findOne({
      user: new Types.ObjectId(userId),
      isActive: true
    });
  }
}
