import { TextContent } from '@resume-optimizer/shared/socket-constants';
import { JobDescription } from './../job-description/job-description.model';
import { StoredMessage, StoredMessageData } from '@langchain/core/messages';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument, Types } from 'mongoose';
import { Resume } from 'src/resume/resume.model';
import { User } from 'src/user/user.model';
import { Field, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

export type ConversationDocument = HydratedDocument<Conversation>;

@ObjectType()
export class TextContentDto {
  @Field(() => String)
  content: string;

  @Field(() => String)
  type: 'ai' | 'human';
}

@ObjectType()
export class StoredMessageDataDto {
  @Field(() => String)
  content: string;

  @Field(() => String)
  role: string | undefined;

  @Field(() => String)
  name: string | undefined;

  @Field(() => String)
  tool_call_id: string | undefined;

  @Field(() => GraphQLJSON)
  additional_kwargs?: Record<string, any>;

  /** Response metadata. For example: response headers, logprobs, token counts. */
  @Field(() => GraphQLJSON)
  response_metadata?: Record<string, any>;

  @Field(() => String)
  id?: string;
}

@ObjectType()
export class StoredMessageDto {
  @Field(() => String)
  type: string;

  @Field(() => StoredMessageDataDto)
  data: StoredMessageData;
}

@Schema()
@ObjectType()
export class Conversation {
  @Field(() => String)
  _id: string;

  @Field(() => User)
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;

  @Field(() => Resume)
  @Prop({ type: Types.ObjectId, ref: 'Resume' })
  baseResume: Resume;

  @Field(() => [[TextContentDto]])
  @Prop({ type: () => [[TextContent]] })
  updatedResumeText: TextContent[][];

  @Field(() => JobDescription)
  @Prop({ type: Types.ObjectId, ref: 'JobDescription' })
  jobDescription: JobDescription;

  @Field(() => Date)
  @Prop({ type: Date, default: () => new Date() })
  startTime: Date;

  @Field(() => [StoredMessageDto])
  @Prop({ type: [Object] })
  messages: StoredMessage[];

  @Field(() => Boolean)
  @Prop({ type: Boolean })
  isActive: boolean;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
