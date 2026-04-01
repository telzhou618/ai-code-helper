/**
 * 消息类型
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  feedback?: 'like' | 'dislike';
}

/**
 * 会话类型
 */
export interface Session {
  id: string;
  memoryId: string;
  title: string;
  timestamp: Date;
}

/**
 * 反馈类型
 */
export type FeedbackType = 'like' | 'dislike';

/**
 * 历史消息内容项
 */
export interface HistoryMessageContent {
  text: string;
  type: string;
}

/**
 * 后端返回的单条历史消息
 */
export interface HistoryMessage {
  text?: string;
  contents?: HistoryMessageContent[];
  type: 'SYSTEM' | 'USER' | 'AI';
}
