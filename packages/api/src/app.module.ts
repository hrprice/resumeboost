import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from 'nestjs-firebase';
import { MongooseModule } from '@nestjs/mongoose';
import { ResumeModule } from './resume/resume.module';
import { JobDescriptionModule } from './job-description/job-description.module';
import configuration from './config/configuration';
import { ChatModule } from './chat/chat.module';
import { LlmModule } from './llm/llm.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      autoSchemaFile: {
        federation: 2,
        path: 'schema.gql'
      },
      driver: ApolloFederationDriver
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('database.host')
      }),
      inject: [ConfigService]
    }),
    FirebaseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        googleApplicationCredential: {
          clientEmail: configService.getOrThrow('gcp.clientEmail'),
          projectId: configService.getOrThrow('gcp.projectId'),
          privateKey: configService.getOrThrow('gcp.privateKey')
        }
      }),
      inject: [ConfigService]
    }),
    AuthModule,
    ResumeModule,
    JobDescriptionModule,
    LlmModule,
    ChatModule
  ]
})
export class AppModule {}
