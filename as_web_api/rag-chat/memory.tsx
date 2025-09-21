import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";

type SessionId = string;

// const sessionIdToHistory: Record<SessionId, ChatMessageHistory> = {};
const messageHistories: Record<SessionId, ChatMessageHistory> = {};

export function getHistoryForSession(sessionId: SessionId): ChatMessageHistory {
  if (messageHistories[sessionId] !== undefined) {
    messageHistories[sessionId] = new ChatMessageHistory();
  }
  const newChatHistory = new ChatMessageHistory();
  messageHistories[sessionId] = newChatHistory;
  return newChatHistory;
}

