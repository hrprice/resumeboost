import { mapStoredMessagesToChatMessages } from '@langchain/core/messages';
import { ChatMessage } from '@resume-optimizer/shared/socket-constants';
import { Conversation } from 'src/chat/chat.model';

export const getConversationMessages = (conversation: Conversation): ChatMessage[] => {
  const messages: ChatMessage[] = [];
  const deserializedMessages = mapStoredMessagesToChatMessages(conversation.messages);
  for (const m of deserializedMessages) {
    const messageType = m.getType();
    const { content, name } = m;
    switch (messageType) {
      case 'human': {
        if (name !== 'resume' && name !== 'job_description') {
          messages.push({ messageType, content: content.toString() });
        }
        continue;
      }
      case 'ai': {
        messages.push({ messageType, content: content.toString() });
        continue;
      }
      default: {
        continue;
      }
    }
  }
  return messages;
};
