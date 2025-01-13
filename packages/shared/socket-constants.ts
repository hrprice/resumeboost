import { IsEnum, IsString } from "@nestjs/class-validator";
enum Chat {
  UserMessage = "chat.userMessage",
  ChatBotMessage = "chat.chatBotMessage",
  MessageHistory = "chat.messageHistory",
  Close = "chat.close",
  AnalyzingComplete = "chat.analyzingComplete",
  NoActiveConversationFound = "chat.noActiveConversationFound",
  StartChat = "chat.startChat",
}

enum Resume {
  Update = "resume.update",
}

enum JobDescription {
  ProcessingComplete = "jobDescription.processingComplete",
}

enum Error {
  ConnectError = "connect_error",
  ConnectTimeout = "connect_timeout",
  Error = "error",
  Disconnect = "disconnect",
  ReconnectError = "reconnect_error",
  ReconnectFailed = "reconnect_failed",
  PingTimeout = "ping_timeout",
}

export const WebsocketEvents = {
  Chat,
  Resume,
  JobDescription,
  Error,
};

interface ResultRange {
  startIndex: number;
  endIndex: number;
}

interface ResultItem {
  substring: string;
  range: ResultRange;
}

export interface ResumeUpdate {
  find: ResultItem;
  replace: string;
}

export interface ChatMessage {
  content: string;
  messageType: "ai" | "human";
}

export interface StartChatData {
  resumeId: string;
  jobUrl: string;
}

export class TextContent {
  content: string;

  type: "original" | "updated";
}

export interface ServerToClientEvents {
  // Errors
  [WebsocketEvents.Error.ConnectError]: (data: string) => void;
  [WebsocketEvents.Error.ConnectTimeout]: (data: string) => void;
  [WebsocketEvents.Error.Error]: (data: string) => void;
  [WebsocketEvents.Error.Disconnect]: (data: string) => void;
  [WebsocketEvents.Error.ReconnectError]: (data: string) => void;
  [WebsocketEvents.Error.ReconnectFailed]: (data: string) => void;
  [WebsocketEvents.Error.PingTimeout]: (data: string) => void;

  // Chat Events
  [WebsocketEvents.Chat.ChatBotMessage]: (data: ChatMessage) => void;
  [WebsocketEvents.Chat.MessageHistory]: (data: ChatMessage[]) => void;
  [WebsocketEvents.Chat.AnalyzingComplete]: () => void;
  [WebsocketEvents.Chat.NoActiveConversationFound]: () => void;

  // Resume Events
  [WebsocketEvents.Resume.Update]: (content: TextContent[][]) => void;

  // Job Description
  [WebsocketEvents.JobDescription.ProcessingComplete]: () => void;
}

export interface ClientToServerEvents {
  [WebsocketEvents.Chat.UserMessage]: (data: ChatMessage) => void;
  [WebsocketEvents.Chat.StartChat]: (data: StartChatData) => void;
  [WebsocketEvents.Chat.Close]: () => void;
}
