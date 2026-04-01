import { useState, useRef, useEffect, useCallback } from 'react';
import { Message, HistoryMessage } from '../types';
import { generateId } from '../utils/date';

const API_BASE = 'http://localhost:8081/api/ai';

interface UseChatProps {
  memoryId: string;
  isNewSession: boolean;
  onFirstMessageSent?: () => void;
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
  content: '我是AI 编程小助手，请问有什么可以帮您？',
  timestamp: new Date(),
});

/**
 * 将后端历史消息映射为前端消息格式
 * 仅保留 USER 和 AI 类型，过滤 SYSTEM
 */
const mapHistoryMessages = (history: HistoryMessage[]): Message[] => {
  return history
    .filter((msg) => msg.type === 'USER' || msg.type === 'AI')
    .map((msg) => ({
      id: generateId(),
      role: msg.type === 'USER' ? 'user' : 'assistant',
      content:
        msg.type === 'USER'
          ? (msg.contents?.map((c) => c.text).join('') || '')
          : (msg.text || ''),
      timestamp: new Date(),
    }));
};

/**
 * 聊天逻辑 Hook
 */
export const useChat = ({ memoryId, isNewSession, onFirstMessageSent }: UseChatProps): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>([
    createWelcomeMessage(),
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 根据 memoryId 加载历史消息或重置为新会话
  useEffect(() => {
    setInputMessage('');
    setHasSentMessage(false);

    if (isNewSession || !memoryId) {
      setMessages([createWelcomeMessage()]);
      return;
    }

    const loadHistoryMessages = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/getSessionMessages?memoryId=${encodeURIComponent(memoryId)}`
        );
        if (!response.ok) {
          throw new Error(`获取历史消息失败: ${response.status}`);
        }

        const text = await response.text();
        const data: HistoryMessage[] = text ? JSON.parse(text) : [];

        if (Array.isArray(data) && data.length > 0) {
          const mapped = mapHistoryMessages(data);
          if (mapped.length > 0) {
            setMessages(mapped);
          } else {
            setMessages([createWelcomeMessage()]);
          }
        } else {
          setMessages([createWelcomeMessage()]);
        }
      } catch (error) {
        console.error('加载历史消息失败:', error);
        setMessages([createWelcomeMessage()]);
      }
    };

    loadHistoryMessages();
  }, [memoryId, isNewSession]);

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

    const effectiveIsNewSession = isNewSession && !hasSentMessage;

    try {
      // 调用 SSE 接口
      let url = `${API_BASE}/chat?memoryId=${encodeURIComponent(memoryId)}&message=${encodeURIComponent(inputMessage)}`;
      if (effectiveIsNewSession) {
        url += '&isNewSession=true';
      }
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

    // 标记当前会话已发送过消息，并通知外部
    if (effectiveIsNewSession) {
      onFirstMessageSent?.();
    }
    setHasSentMessage(true);
  }, [inputMessage, isLoading, memoryId, isNewSession, hasSentMessage, onFirstMessageSent]);

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
