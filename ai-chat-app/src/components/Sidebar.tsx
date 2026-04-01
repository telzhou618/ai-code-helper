import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Session } from '../types';

interface SidebarProps {
  sessions: Session[];
  currentSession: Session;
  onSessionSelect: (session: Session) => void;
  onNewSession: () => void;
  onDeleteSession?: (session: Session) => void;
}

/**
 * 侧边栏组件
 * 包含新建会话按钮和会话列表
 */
export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSession,
  onSessionSelect,
  onNewSession,
  onDeleteSession,
}) => {
  const [hoveredSessionId, setHoveredSessionId] = useState<string | null>(null);

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* 新建会话按钮 */}
      <div className="p-4">
        <button
          onClick={onNewSession}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span>新建会话</span>
        </button>
      </div>

      {/* 最近会话列表 */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2 text-sm text-gray-500 font-medium">
          最近会话列表：
        </div>
        <div className="space-y-1 px-2">
          {sessions.map((session, index) => (
            <div
              key={session.id}
              className="relative"
              onMouseEnter={() => setHoveredSessionId(session.id)}
              onMouseLeave={() => setHoveredSessionId(null)}
            >
              <button
                onClick={() => onSessionSelect(session)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors pr-8 ${
                  currentSession.id === session.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {index + 1}.{session.title}
              </button>

              {hoveredSessionId === session.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession?.(session);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="删除会话"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
