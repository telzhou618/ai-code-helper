import React from 'react';
import { Menu, LogOut } from 'lucide-react';

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  onLogout?: () => void;
}

/**
 * 顶部导航栏组件
 */
export const Header: React.FC<HeaderProps> = ({
  userName = '张三',
  userAvatar = '张',
  onLogout,
}) => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <Menu className="text-gray-600" size={20} />
        <h1 className="text-lg font-semibold text-gray-800">智能客服平台</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {userAvatar}
          </div>
          <span className="text-sm text-gray-700">{userName}</span>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <LogOut size={16} />
          <span>退出</span>
        </button>
      </div>
    </div>
  );
};
