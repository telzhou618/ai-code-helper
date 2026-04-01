import { useState, useCallback, useEffect } from 'react';
import { Session } from '../types';
import { generateMemoryId, generateId } from '../utils/date';

const API_BASE = 'http://localhost:8081/api/ai';

interface UseSessionsReturn {
  sessions: Session[];
  currentSession: Session;
  setCurrentSession: (session: Session) => void;
  createNewSession: () => Session;
  isCurrentSessionNew: boolean;
  markCurrentSessionUsed: () => void;
  isLoading: boolean;
}

/**
 * 从 URL 获取 memoryId
 */
const getMemoryIdFromUrl = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get('memoryId');
};

/**
 * 更新 URL 中的 memoryId
 */
const updateUrl = (memoryId: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set('memoryId', memoryId);
  window.history.replaceState({}, '', url.toString());
};

/**
 * 会话管理 Hook
 */
export const useSessions = (): UseSessionsReturn => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSessionState] = useState<Session | null>(null);
  const [newSessionIds, setNewSessionIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const isCurrentSessionNew = currentSession ? newSessionIds.has(currentSession.memoryId) : false;

  /**
   * 设置当前会话并同步 URL
   */
  const setCurrentSession = useCallback((session: Session) => {
    setCurrentSessionState(session);
    setNewSessionIds((prev) => {
      const next = new Set(prev);
      next.delete(session.memoryId);
      return next;
    });
    updateUrl(session.memoryId);
  }, []);

  /**
   * 标记当前会话已使用过（不再是新会话）
   */
  const markCurrentSessionUsed = useCallback(() => {
    if (currentSession) {
      setNewSessionIds((prev) => {
        const next = new Set(prev);
        next.delete(currentSession.memoryId);
        return next;
      });
    }
  }, [currentSession]);

  /**
   * 创建新会话
   * @returns 新创建的会话
   */
  const createNewSession = useCallback((): Session => {
    const newSession: Session = {
      id: generateId(),
      memoryId: generateMemoryId(),
      title: `新会话 ${sessions.length + 1}`,
      timestamp: new Date(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionState(newSession);
    setNewSessionIds((prev) => new Set(prev).add(newSession.memoryId));
    updateUrl(newSession.memoryId);
    return newSession;
  }, [sessions.length]);

  // 初始加载会话列表
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(`${API_BASE}/getSessions`);
        if (!response.ok) {
          throw new Error(`获取会话列表失败: ${response.status}`);
        }
        const data = await response.json();
        const mappedSessions: Session[] = data.map((item: any) => ({
          id: item.memoryId?.toString() || generateId(),
          memoryId: item.memoryId?.toString() || '',
          title: item.title || '未命名会话',
          timestamp: new Date(item.createdAt || Date.now()),
        }));
        setSessions(mappedSessions);

        const urlMemoryId = getMemoryIdFromUrl();
        if (urlMemoryId) {
          const matched = mappedSessions.find((s) => s.memoryId === urlMemoryId);
          if (matched) {
            setCurrentSessionState(matched);
          } else {
            // URL 中的会话不在列表中，视为新建会话
            const newSession: Session = {
              id: generateId(),
              memoryId: urlMemoryId,
              title: '新会话',
              timestamp: new Date(),
            };
            setSessions((prev) => [newSession, ...prev]);
            setCurrentSessionState(newSession);
            setNewSessionIds((prev) => new Set(prev).add(urlMemoryId));
          }
        } else if (mappedSessions.length > 0) {
          setCurrentSessionState(mappedSessions[0]);
          updateUrl(mappedSessions[0].memoryId);
        } else {
          // 没有任何会话时创建一个默认会话
          const defaultSession = createNewSession();
          setCurrentSessionState(defaultSession);
        }
      } catch (error) {
        console.error('获取会话列表失败:', error);
        // 出错时创建一个默认会话
        const defaultSession: Session = {
          id: generateId(),
          memoryId: generateMemoryId(),
          title: '新会话',
          timestamp: new Date(),
        };
        setSessions([defaultSession]);
        setCurrentSessionState(defaultSession);
        updateUrl(defaultSession.memoryId);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 提供一个安全的 currentSession 默认值，防止 null
  const safeCurrentSession = currentSession || {
    id: generateId(),
    memoryId: generateMemoryId(),
    title: '新会话',
    timestamp: new Date(),
  };

  return {
    sessions,
    currentSession: safeCurrentSession,
    setCurrentSession,
    createNewSession,
    isCurrentSessionNew,
    markCurrentSessionUsed,
    isLoading,
  };
};
