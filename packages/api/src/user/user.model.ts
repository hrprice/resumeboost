import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Field, ID, InputType, ObjectType, OmitType, PartialType, registerEnumType } from '@nestjs/graphql';

export type UserDocument = HydratedDocument<User>;

export enum OnboardingStep {
  Complete = 'Complete',
  JobsTab = 'JobsTab',
  ResumeTab = 'ResumeTab',
  ResumeUpdate = 'ResumeUpdate',
  SendMessage = 'SendMessage',
  StartChat = 'StartChat'
}

registerEnumType(OnboardingStep, { name: 'OnboardingStep' });

@Schema()
@ObjectType()
export class User {
  @Field(() => ID)
  _id: string;

  @Prop()
  @Field(() => String)
  firstName: string;

  @Prop()
  @Field(() => String)
  lastName: string;

  @Prop()
  @Field(() => String)
  email: string;

  @Prop()
  @Field(() => Boolean)
  emailVerified: boolean;

  @Prop()
  @Field(() => OnboardingStep)
  onboardingStep: OnboardingStep;
}

export class UpdateUserInput extends OmitType(PartialType(User), ['_id'], InputType) {
  @Field(() => String)
  _id: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
