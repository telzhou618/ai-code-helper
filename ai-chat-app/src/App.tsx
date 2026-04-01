import React, { useEffect } from 'react';
import { Sidebar, Header, ChatArea, ChatInput, Footer } from './components';
import { useSessions } from './hooks/useSessions';
import { useChat } from './hooks/useChat';

/**
 * 智能客服应用主组件
 */
function App() {
  // 会话管理
  const {
    sessions,
    currentSession,
    setCurrentSession,
    createNewSession,
    isCurrentSessionNew,
    markCurrentSessionUsed,
    isLoading: sessionsLoading,
  } = useSessions();

  // 聊天逻辑
  const {
    messages,
    inputMessage,
    isLoading,
    setInputMessage,
    sendMessage,
    handleFeedback,
    resetMessages,
    messagesEndRef,
  } = useChat({
    memoryId: currentSession.memoryId,
    isNewSession: isCurrentSessionNew,
    onFirstMessageSent: markCurrentSessionUsed,
  });

  // 切换会话时重置消息
  useEffect(() => {
    resetMessages();
  }, [currentSession.id, resetMessages]);

  /**
   * 处理新建会话
   */
  const handleNewSession = () => {
    createNewSession();
  };

  /**
   * 处理会话切换
   */
  const handleSessionSelect = (session: typeof currentSession) => {
    setCurrentSession(session);
  };

  /**
   * 处理登出
   */
  const handleLogout = () => {
    // TODO: 实现登出逻辑
    console.log('用户登出');
  };

  if (sessionsLoading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 左侧边栏 */}
      <Sidebar
        sessions={sessions}
        currentSession={currentSession}
        onSessionSelect={handleSessionSelect}
        onNewSession={handleNewSession}
      />

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部导航栏 */}
        <Header onLogout={handleLogout} />

        {/* 聊天区域 */}
        <ChatArea
          messages={messages}
          onFeedback={handleFeedback}
          messagesEndRef={messagesEndRef}
          isLoading={isLoading}
        />

        {/* 输入区域 */}
        <ChatInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={sendMessage}
          isLoading={isLoading}
        />

        {/* 底部版权信息 */}
        <Footer />
      </div>
    </div>
  );
}

export default App;
