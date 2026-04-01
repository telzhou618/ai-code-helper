import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Message, FeedbackType } from '../types';
import { formatRelativeTime } from '../utils/date';

interface ChatMessageProps {
  message: Message;
  onFeedback?: (messageId: string, feedback: FeedbackType) => void;
  isLoading?: boolean;
}

/**
 * Markdown 渲染组件
 * 用于 AI 消息显示
 */
const MarkdownContent: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="markdown-body text-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 代码块
          code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !className;
            return isInline ? (
              <code
                className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs font-mono"
                {...props}
              >
                {children}
              </code>
            ) : (
              <div className="my-2">
                <div className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-t-lg">
                  {match ? match[1] : 'code'}
                </div>
                <pre className="bg-gray-800 text-gray-100 p-3 rounded-b-lg overflow-x-auto text-xs">
                  <code {...props}>{children}</code>
                </pre>
              </div>
            );
          },
          // 段落
          p({ children }) {
            return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
          },
          // 标题
          h1({ children }) {
            return <h1 className="text-lg font-bold mb-2 mt-3">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-base font-bold mb-2 mt-3">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-sm font-bold mb-1 mt-2">{children}</h3>;
          },
          // 列表
          ul({ children }) {
            return <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>;
          },
          li({ children }) {
            return <li className="ml-2">{children}</li>;
          },
          // 引用
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-gray-300 pl-3 py-1 my-2 text-gray-600 bg-gray-50 rounded-r">
                {children}
              </blockquote>
            );
          },
          // 表格
          table({ children }) {
            return (
              <div className="overflow-x-auto my-2">
                <table className="min-w-full border-collapse border border-gray-300 text-xs">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-gray-100">{children}</thead>;
          },
          th({ children }) {
            return (
              <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                {children}
              </th>
            );
          },
          td({ children }) {
            return <td className="border border-gray-300 px-3 py-2">{children}</td>;
          },
          // 链接
          a({ children, href }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {children}
              </a>
            );
          },
          // 分割线
          hr() {
            return <hr className="my-3 border-gray-200" />;
          },
          // 强调
          strong({ children }) {
            return <strong className="font-bold">{children}</strong>;
          },
          em({ children }) {
            return <em className="italic">{children}</em>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

/**
 * 单条消息组件
 */
export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onFeedback,
  isLoading = false,
}) => {
  const isUser = message.role === 'user';
  const showLoading = !isUser && isLoading && !message.content;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex gap-3 max-w-[70%] ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* 头像 */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 ${
            isUser ? 'bg-gray-600' : 'bg-gray-500'
          }`}
        >
          {isUser ? '我' : 'AI'}
        </div>

        {/* 消息内容 */}
        <div className="flex flex-col">
          <div
            className={`px-4 py-3 rounded-2xl ${
              isUser
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-800'
            }`}
          >
            {showLoading ? (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
              </div>
            ) : isUser ? (
              // 用户消息保持纯文本
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            ) : (
              // AI 消息支持 Markdown
              <MarkdownContent content={message.content} />
            )}
          </div>

          {/* 时间和反馈 */}
          <div
            className={`flex items-center gap-2 mt-1 text-xs text-gray-400 ${
              isUser ? 'justify-end' : 'justify-start'
            }`}
          >
            <span>{formatRelativeTime(message.timestamp)}</span>
            {!isUser && message.content && onFeedback && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onFeedback(message.id, 'like')}
                  className={`p-1 rounded transition-colors ${
                    message.feedback === 'like'
                      ? 'text-blue-600'
                      : 'hover:text-gray-600'
                  }`}
                >
                  <ThumbsUp size={14} />
                </button>
                <button
                  onClick={() => onFeedback(message.id, 'dislike')}
                  className={`p-1 rounded transition-colors ${
                    message.feedback === 'dislike'
                      ? 'text-red-600'
                      : 'hover:text-gray-600'
                  }`}
                >
                  <ThumbsDown size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
