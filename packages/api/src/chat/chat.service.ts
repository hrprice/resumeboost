import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { END, MemorySaver, MessagesAnnotation, START, StateGraph } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, MessageContent, SystemMessage } from '@langchain/core/messages';
import { ResumeService } from '../resume/resume.service';
import { JobDescriptionService } from '../job-description/job-description.service';
import { Resume } from '../resume/resume.model';
import { tool } from '@langchain/core/tools';
import { SendUpdateSchema } from './chat.dto';
import { Socket } from 'socket.io';
import { ToolNode, toolsCondition } from '@langchain/langgraph/prebuilt';
import { CHATBOT_SYSTEM_PROMPT } from '../../constants/chatbot-constants';

export type ChatBot = (message: string) => Promise<MessageContent | null>;

@Injectable()
export class ChatService {
  constructor(
    private readonly configService: ConfigService,
    private readonly resumeService: ResumeService,
    private readonly jobDescriptionService: JobDescriptionService
  ) {}

  async getChatbot(threadId: string, resume: Resume, jobDescriptionUrl: string, websocket: Socket): Promise<ChatBot> {
    let resumeText = await this.resumeService.parseResumeText(resume);
    websocket.emit('resume.processingComplete');
    const jobDescription = await this.jobDescriptionService.parseJobDescription(jobDescriptionUrl);
    websocket.emit('jobDescription.processingComplete');
    const llm = new ChatOpenAI({
      model: this.configService.get('OPENAI_CHAT_MODEL', 'gpt-3.5-turbo'),
      apiKey: this.configService.getOrThrow('OPENAI_API_KEY')
    });

    const updateResume = (resume: string, find: string, replace: string) => {
      const updatedResume = resume.replace(new RegExp(find, 'g'), replace);
      resumeText = updatedResume;
      return updatedResume;
    };

    const sendUpdate = async ({ find, replace }: { find: string; replace: string }): Promise<string> => {
      websocket.emit('resume.update', { find, replace });
      return updateResume(resumeText, find, replace);
    };

    const endChat = async () => {
      websocket.emit('chat.close');
      websocket.disconnect(true);
      return 'chat ended';
    };

    const sendUpdateTool = tool(sendUpdate, {
      name: 'sendUpdate',
      description: 'updates a piece of text in a resume in find/replace format',
      responseFormat: 'content',
      schema: SendUpdateSchema
    });

    const endChatTool = tool(endChat, {
      name: 'endChat',
      description:
        'terminates the chat session with the user, should be invoked when the resume is sufficiently optimized'
    });

    const chatAndUpdate = async (state: typeof MessagesAnnotation.State) => {
      const llmWithTools = llm.bindTools([sendUpdateTool, endChatTool]);
      const res = await llmWithTools.invoke(state.messages);
      return { messages: [res] };
    };

    const tools = new ToolNode([sendUpdateTool, endChatTool]);

    const checkpointer = new MemorySaver();

    const app = new StateGraph(MessagesAnnotation)
      .addNode('chatAndUpdate', chatAndUpdate)
      .addNode('tools', tools)
      .addEdge(START, 'chatAndUpdate')
      .addConditionalEdges('chatAndUpdate', toolsCondition, ['tools', END])
      .addEdge('tools', 'chatAndUpdate')
      .compile({ checkpointer });

    const initialRes = await app.invoke(
      {
        messages: [
          new SystemMessage(CHATBOT_SYSTEM_PROMPT),
          new HumanMessage({ name: 'resume', content: resumeText }),
          new HumanMessage({ name: 'job_description', content: JSON.stringify(jobDescription) })
        ]
      },
      { configurable: { thread_id: threadId } }
    );

    websocket.emit('chat.analyzingComplete');
    websocket.emit('chat.chatBotMessage', { message: initialRes.messages.at(-1)?.content });

    return async (message: string) => {
      const res = await app.invoke(
        { messages: [new HumanMessage(message)] },
        { configurable: { thread_id: threadId } }
      );
      return res.messages.at(-1)?.content || null;
    };
  }
}
