import React from 'react';
import { ChatMessage } from './ChatMessage';
import { Message, FeedbackType } from '../types';

interface ChatAreaProps {
  messages: Message[];
  onFeedback?: (messageId: string, feedback: FeedbackType) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  isLoading?: boolean;
}

/**
 * 聊天区域组件
 * 显示所有消息列表
 */
export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  onFeedback,
  messagesEndRef,
  isLoading = false,
}) => {
  // 判断最后一条消息是否是正在加载的 AI 消息
  const lastMessage = messages[messages.length - 1];
  const isLastMessageLoading = isLoading && lastMessage?.role === 'assistant';

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            onFeedback={onFeedback}
            isLoading={index === messages.length - 1 ? isLastMessageLoading : false}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
