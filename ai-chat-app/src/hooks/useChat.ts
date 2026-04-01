import { useState, useRef, useEffect, useCallback } from 'react';
import { Message } from '../types';
import { generateId } from '../utils/date';

interface UseChatProps {
  memoryId: string;
}

interface UseChatReturn {
  messages: Message[];
  inputMessage: string;
  isLoading: boolean;
  setInputMessage: (message: string) => void;
  sendMessage: () => Promise<void>;
  handleFeedback: (messageId: string, feedback: 'like' | 'dislike') => void;
  resetMessages: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

// 初始欢迎消息
const createWelcomeMessage = (): Message => ({
  id: generateId(),
  role: 'assistant',
  content: '我是智能客服助手，请问有什么可以帮您？',
  timestamp: new Date(),
});

/**
 * 聊天逻辑 Hook
 */
export const useChat = ({ memoryId }: UseChatProps): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>([
    createWelcomeMessage(),
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  /**
   * 发送消息
   */
  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    // 创建 AI 消息占位
    const aiMessageId = generateId();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // 调用 SSE 接口
      const url = `http://localhost:8081/api/ai/chat?memoryId=${memoryId}&message=${encodeURIComponent(inputMessage)}`;
      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        if (event.data) {
          const data = event.data;
          setMessages((prev) => {
            // 找到最后一条 AI 消息（即当前正在接收回复的消息）
            const lastAiMessageIndex = [...prev].reverse().findIndex(
              (msg) => msg.role === 'assistant'
            );
            if (lastAiMessageIndex === -1) return prev;
            
            const actualIndex = prev.length - 1 - lastAiMessageIndex;
            return prev.map((msg, index) => {
              if (index === actualIndex) {
                return { ...msg, content: msg.content + data };
              }
              return msg;
            });
          });
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setIsLoading(false);
      };

      eventSource.addEventListener('close', () => {
        eventSource.close();
        setIsLoading(false);
      });
    } catch (error) {
      console.error('发送消息失败:', error);
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, memoryId]);

  /**
   * 处理反馈
   */
  const handleFeedback = useCallback((messageId: string, feedback: 'like' | 'dislike') => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );
  }, []);

  /**
   * 重置消息
   */
  const resetMessages = useCallback(() => {
    setMessages([createWelcomeMessage()]);
  }, []);

  return {
    messages,
    inputMessage,
    isLoading,
    setInputMessage,
    sendMessage,
    handleFeedback,
    resetMessages,
    messagesEndRef,
  };
};
