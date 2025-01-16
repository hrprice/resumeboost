import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { JobDescriptionService } from '../job-description/job-description.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Resume, ResumeSchema } from '../resume/resume.model';
import { ResumeModule } from '../resume/resume.module';
import { LlmModule } from '../llm/llm.module';
import { AuthModule } from 'src/auth/auth.module';
import { Conversation, ConversationSchema } from './chat.model';
import { ContextModule } from 'src/context/context.module';
import { UserModule } from 'src/user/user.module';
import { JobDescription, JobDescriptionSchema } from 'src/job-description/job-description.model';
import { ChatResolver } from './chat.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }]),
    MongooseModule.forFeature([{ name: Conversation.name, schema: ConversationSchema }]),
    MongooseModule.forFeature([{ name: JobDescription.name, schema: JobDescriptionSchema }]),
    UserModule,
    ResumeModule,
    LlmModule,
    AuthModule,
    ContextModule
  ],
  providers: [ChatGateway, ChatService, JobDescriptionService, ChatResolver]
})
export class ChatModule {}
