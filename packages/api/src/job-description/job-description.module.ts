import { Module } from '@nestjs/common';
import { JobDescriptionService } from './job-description.service';
import { JobDescriptionResolver } from './job-description.resolver';
import { LlmModule } from '../llm/llm.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [LlmModule, ConfigModule],
  providers: [JobDescriptionService, JobDescriptionResolver]
})
export class JobDescriptionModule {}
