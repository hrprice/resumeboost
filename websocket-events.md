## Websocket Events

#### Chat Events

`chat.userMessage`

- subscribing event for incoming chat messages

`chat.chatBotMessage`

- emitted by chatbot for outgoing chat messages

`chat.close`

- emitted by llm agent to close the chat session before closing the websocket connection

`chat.analyzingComplete`

- emitted after initial llm invocation completes, before first chat message

#### Resume Events

`resume.processingComplete`

- emitted in `chatService.getChatbot()` after `resumeService.parseResumeText` completes

`resume.update`

- emitted by the llm agent to update a piece of the resume in find/replace format. data schema: {find: string, replace: string}

#### Job Description Events

`jobDescription.processingComplete`

- emitted in `chatService.getChatbot()` after `jobDescriptionService.parseJobDescription` completes
