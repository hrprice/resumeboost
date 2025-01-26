import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from 'nestjs-firebase';
import { MongooseModule } from '@nestjs/mongoose';
import { ResumeModule } from './resume/resume.module';
import { JobDescriptionModule } from './job-description/job-description.module';
import { ChatModule } from './chat/chat.module';
import { LlmModule } from './llm/llm.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ContextInterceptor } from './context/context.interceptor';
import { ContextModule } from './context/context.module';
import { UserModule } from './user/user.module';
import GraphQLJSON from 'graphql-type-json';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      autoSchemaFile: {
        federation: 2,
        path: 'schema.gql'
      },
      driver: ApolloFederationDriver,
      resolvers: { JSON: GraphQLJSON }
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('MONGO_URI')
      }),
      inject: [ConfigService]
    }),
    FirebaseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        googleApplicationCredential: {
          clientEmail: configService.getOrThrow('GCP_CLIENT_EMAIL'),
          projectId: configService.getOrThrow('GCP_PROJECT_ID'),
          privateKey: configService.getOrThrow('GCP_PRIVATE_KEY')
        }
      }),
      inject: [ConfigService]
    }),
    AuthModule,
    ResumeModule,
    JobDescriptionModule,
    LlmModule,
    ChatModule,
    ContextModule,
    UserModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ContextInterceptor
    }
  ],
  exports: [ContextModule]
})
export class AppModule {}
