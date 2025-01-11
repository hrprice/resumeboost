import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { JobDescriptionService } from '../job-description/job-description.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Resume, ResumeSchema } from '../resume/resume.model';
import { ResumeModule } from '../resume/resume.module';
import { LlmModule } from '../llm/llm.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }]),
    ResumeModule,
    LlmModule,
    AuthModule
  ],
  providers: [ChatGateway, ChatService, JobDescriptionService]
})
export class ChatModule {}
