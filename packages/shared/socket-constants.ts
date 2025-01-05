enum Chat {
  UserMessage = "chat.userMessage",
  ChatBotMessage = "chat.chatBotMessage",
  Close = "chat.close",
  AnalyzingComplete = "chat.analyzingComplete",
}

enum Resume {
  ProcessingComplete = "resume.processingComplete",
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
