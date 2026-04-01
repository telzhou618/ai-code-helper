import React from 'react';
import { Send, Search } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  isSearching?: boolean;
  onSearchChange?: (value: boolean) => void;
}

/**
 * 聊天输入组件
 */
export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  isLoading = false,
  isSearching = true,
  onSearchChange,
}) => {
  /**
   * 处理回车发送
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="px-6 pb-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="有问题尽管问，按回车发送消息"
            className="w-full px-4 py-3 bg-transparent border-none resize-none focus:outline-none text-sm text-gray-800 placeholder-gray-400"
            rows={2}
            disabled={isLoading}
          />
          <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSearching}
                onChange={(e) => onSearchChange?.(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Search size={14} />
                联网搜索
              </span>
            </label>
            <button
              onClick={onSend}
              disabled={!value.trim() || isLoading}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
