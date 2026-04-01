import { useState, useCallback } from 'react';
import { Session } from '../types';
import { generateMemoryId, generateId } from '../utils/date';

// 初始假数据
const INITIAL_SESSIONS: Session[] = [
  { id: '1', memoryId: '24525399', title: '会话标题1', timestamp: new Date() },
  { id: '2', memoryId: '24525400', title: '会话标题2', timestamp: new Date(Date.now() - 86400000) },
  { id: '3', memoryId: '24525401', title: '会话标题3', timestamp: new Date(Date.now() - 172800000) },
  { id: '4', memoryId: '24525402', title: '会话标题4', timestamp: new Date(Date.now() - 259200000) },
];

interface UseSessionsReturn {
  sessions: Session[];
  currentSession: Session;
  setCurrentSession: (session: Session) => void;
  createNewSession: () => Session;
}

/**
 * 会话管理 Hook
 */
export const useSessions = (): UseSessionsReturn => {
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [currentSession, setCurrentSession] = useState<Session>(INITIAL_SESSIONS[0]);

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
    setCurrentSession(newSession);
    return newSession;
  }, [sessions.length]);

  return {
    sessions,
    currentSession,
    setCurrentSession,
    createNewSession,
  };
};
