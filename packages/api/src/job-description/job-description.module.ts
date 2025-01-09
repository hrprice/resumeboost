import { Module } from '@nestjs/common';
import { JobDescriptionService } from './job-description.service';
import { JobDescriptionResolver } from './job-description.resolver';
import { LlmModule } from '../llm/llm.module';
import { ConfigModule } from '@nestjs/config';
import { PlaywrightModule } from 'nestjs-playwright';

@Module({
  imports: [LlmModule, ConfigModule, PlaywrightModule.forRoot()],
  providers: [JobDescriptionService, JobDescriptionResolver]
})
export class JobDescriptionModule {}
