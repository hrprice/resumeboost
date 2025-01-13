import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type JobDescriptionDocument = HydratedDocument<JobDescription>;

@ObjectType()
@Schema()
export class JobDescription {
  @Field(() => String)
  _id: string;

  @Prop()
  @Field(() => String)
  url: string;

  @Prop()
  @Field(() => String)
  jobTitle: string;

  @Prop()
  @Field(() => String)
  companyName: string;

  @Prop()
  @Field(() => String)
  location: string;

  @Prop({ type: String })
  @Field(() => String, { nullable: true })
  employmentType?: string | null;

  @Prop({ type: [String] })
  @Field(() => [String], { nullable: true })
  responsibilities?: string[] | null;

  @Prop({ type: [String] })
  @Field(() => [String], { nullable: true })
  requirements?: string[] | null;

  @Prop({ type: [String] })
  @Field(() => [String], { nullable: true })
  preferredQualifications?: string[] | null;

  @Prop({ type: [String] })
  @Field(() => [String], { nullable: true })
  benefits?: string[] | null;

  @Prop({ type: [String] })
  @Field(() => [String], { nullable: true })
  keywords?: string[] | null;
}

export const JobDescriptionSchema = SchemaFactory.createForClass(JobDescription);
