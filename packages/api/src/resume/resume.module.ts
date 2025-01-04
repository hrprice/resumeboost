import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Resume, ResumeSchema } from './resume.model';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { ResumeResolver } from './resume.resolver';
import { ResumePipe } from './resume.pipe';
import { ConfigModule } from '@nestjs/config';
import { LlmModule } from '../llm/llm.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }]), ConfigModule, LlmModule],
  controllers: [ResumeController],
  providers: [ResumeService, ResumeResolver, ResumePipe],
  exports: [ResumePipe, ResumeService]
})
export class ResumeModule {}
