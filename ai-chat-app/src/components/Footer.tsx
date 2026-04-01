import React from 'react';

interface FooterProps {
  copyright?: string;
}

/**
 * 底部版权组件
 */
export const Footer: React.FC<FooterProps> = ({
  copyright = '版权信息 © 2024 智能客服平台',
}) => {
  return (
    <div className="px-6 py-3 border-t border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto text-center text-xs text-gray-400">
        {copyright}
      </div>
    </div>
  );
};
