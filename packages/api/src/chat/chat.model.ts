import { TextContent } from '@resume-optimizer/shared/socket-constants';
import { JobDescription } from './../job-description/job-description.model';
import { StoredMessage } from '@langchain/core/messages';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument, Types } from 'mongoose';
import { Resume } from 'src/resume/resume.model';
import { User } from 'src/user/user.model';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema()
export class Conversation {
  _id: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'Resume' })
  baseResume: Resume;

  @Prop({ type: () => [[TextContent]] })
  updatedResumeText: TextContent[][];

  @Prop({ type: Types.ObjectId, ref: 'JobDescription' })
  jobDescription: JobDescription;

  @Prop({ type: Date, default: () => new Date() })
  startTime: Date;

  @Prop({ type: [Object] })
  messages: StoredMessage[];

  @Prop()
  isActive: boolean;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
