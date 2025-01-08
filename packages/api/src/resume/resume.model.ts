import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema()
@ObjectType()
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

  @Prop()
  @Field(() => String)
  textContent: string;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
