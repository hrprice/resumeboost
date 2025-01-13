import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.model';
import * as mongoose from 'mongoose';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema()
@ObjectType()
export class Resume {
  @Field(() => ID)
  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @Field(() => User)
  user: User;

  @Prop()
  @Field(() => String)
  fileName: string;

  @Prop()
  @Field(() => Number)
  size: number;

  @Prop()
  @Field(() => String)
  mimeType: string;

  @Prop()
  @Field(() => [String])
  textContent: string[];
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
