import { IsEmail } from '@nestjs/class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegistrationInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  registrationSecret: string;
}
