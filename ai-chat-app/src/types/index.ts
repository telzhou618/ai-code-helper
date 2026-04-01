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
