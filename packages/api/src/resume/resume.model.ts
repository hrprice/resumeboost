import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema()
@ObjectType()
@InputType()
export class Resume {
  @Field(() => ID)
  _id: string;

  @Prop()
  @Field(() => String)
  fileName: string;

  @Prop()
  @Field(() => Number)
  size: number;

  @Prop()
  @Field(() => String)
  mimeType: string;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
