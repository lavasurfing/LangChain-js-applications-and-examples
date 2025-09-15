import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";

type SessionId = string;

const sessionIdToHistory: Record<SessionId, ChatMessageHistory> = {};

export function getHistoryForSession(sessionId: SessionId): ChatMessageHistory {
  if (!sessionIdToHistory[sessionId]) {
    sessionIdToHistory[sessionId] = new ChatMessageHistory();
  }
  return sessionIdToHistory[sessionId];
}



