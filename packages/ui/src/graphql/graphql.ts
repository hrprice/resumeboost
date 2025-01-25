/* Generated File DO NOT EDIT. */
/* tslint:disable */
/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  _Any: { input: any; output: any; }
  federation__FieldSet: { input: any; output: any; }
  link__Import: { input: any; output: any; }
};

export type Conversation = {
  __typename?: 'Conversation';
  _id: Scalars['String']['output'];
  baseResume: Resume;
  isActive: Scalars['Boolean']['output'];
  jobDescription: JobDescription;
  messages: Array<StoredMessageDto>;
  startTime: Scalars['DateTime']['output'];
  updatedResumeText: Array<Array<TextContentDto>>;
  user: User;
};

export type JobDescription = {
  __typename?: 'JobDescription';
  _id: Scalars['String']['output'];
  benefits?: Maybe<Array<Scalars['String']['output']>>;
  companyName: Scalars['String']['output'];
  employmentType?: Maybe<Scalars['String']['output']>;
  jobTitle: Scalars['String']['output'];
  keywords?: Maybe<Array<Scalars['String']['output']>>;
  location: Scalars['String']['output'];
  preferredQualifications?: Maybe<Array<Scalars['String']['output']>>;
  requirements?: Maybe<Array<Scalars['String']['output']>>;
  responsibilities?: Maybe<Array<Scalars['String']['output']>>;
  url: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  registerWithEmailAndPassword: User;
  updateOnboardingStep: User;
};


export type MutationRegisterWithEmailAndPasswordArgs = {
  registrationInput: RegistrationInput;
};


export type MutationUpdateOnboardingStepArgs = {
  onboardingStep: OnboardingStep;
};

export enum OnboardingStep {
  Complete = 'Complete',
  JobsTab = 'JobsTab',
  ResumeTab = 'ResumeTab',
  ResumeUpdate = 'ResumeUpdate',
  SendMessage = 'SendMessage',
  StartChat = 'StartChat'
}

export type Query = {
  __typename?: 'Query';
  _service: _Service;
  getAllConversations: Array<Conversation>;
  getAllResumes: Array<Resume>;
  getConversationById: Conversation;
  getJobDescription: JobDescription;
  getJobDescriptionContent: Scalars['String']['output'];
  getParsedJobDescription: JobDescription;
  getResume: Resume;
  getUser: User;
};


export type QueryGetConversationByIdArgs = {
  conversationId: Scalars['String']['input'];
};


export type QueryGetJobDescriptionContentArgs = {
  jobUrl: Scalars['String']['input'];
};


export type QueryGetParsedJobDescriptionArgs = {
  jobUrl: Scalars['String']['input'];
};


export type QueryGetResumeArgs = {
  resume: Scalars['String']['input'];
};

export type RegistrationInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  registrationSecret: Scalars['String']['input'];
};

export type Resume = {
  __typename?: 'Resume';
  _id: Scalars['ID']['output'];
  fileName: Scalars['String']['output'];
  mimeType: Scalars['String']['output'];
  size: Scalars['Float']['output'];
  textContent: Array<Scalars['String']['output']>;
  user: User;
};

export type StoredMessageDataDto = {
  __typename?: 'StoredMessageDataDto';
  additional_kwargs: Scalars['JSON']['output'];
  content: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  response_metadata: Scalars['JSON']['output'];
  role: Scalars['String']['output'];
  tool_call_id: Scalars['String']['output'];
};

export type StoredMessageDto = {
  __typename?: 'StoredMessageDto';
  data: StoredMessageDataDto;
  type: Scalars['String']['output'];
};

export type TextContentDto = {
  __typename?: 'TextContentDto';
  content: Scalars['String']['output'];
  type: TextContentType;
};

export enum TextContentType {
  Original = 'Original',
  Updated = 'Updated'
}

export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  onboardingStep: OnboardingStep;
};

export type _Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']['output']>;
};

export enum Link__Purpose {
  /** `EXECUTION` features provide metadata necessary for operation execution. */
  Execution = 'EXECUTION',
  /** `SECURITY` features provide metadata necessary to securely resolve fields. */
  Security = 'SECURITY'
}
