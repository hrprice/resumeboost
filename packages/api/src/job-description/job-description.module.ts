import { Module } from '@nestjs/common';
import { JobDescriptionService } from './job-description.service';
import { JobDescriptionResolver } from './job-description.resolver';
import { LlmModule } from '../llm/llm.module';
import { ConfigModule } from '@nestjs/config';
import { PlaywrightModule } from 'nestjs-playwright';
import { AuthModule } from '../auth/auth.module';
import { JobDescription, JobDescriptionSchema } from './job-description.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    LlmModule,
    ConfigModule,
    PlaywrightModule.forRoot(),
    AuthModule,
    MongooseModule.forFeature([{ name: JobDescription.name, schema: JobDescriptionSchema }])
  ],
  providers: [JobDescriptionService, JobDescriptionResolver]
})
export class JobDescriptionModule {}
