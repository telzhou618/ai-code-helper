import React from 'react';
import { Plus } from 'lucide-react';
import { Session } from '../types';

interface SidebarProps {
  sessions: Session[];
  currentSession: Session;
  onSessionSelect: (session: Session) => void;
  onNewSession: () => void;
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
}) => {
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
            <button
              key={session.id}
              onClick={() => onSessionSelect(session)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                currentSession.id === session.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {index + 1}.{session.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
