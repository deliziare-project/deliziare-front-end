import React from 'react';

interface TypingIndicatorProps {
  name?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ name = 'User' }) => {
  return (
    <div className="flex flex-col items-start">
      <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm">
        <div className="flex items-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce\" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
      <span className="text-xs text-gray-500 mt-1 ml-1">{name} is typing...</span>
    </div>
  );
};

export default TypingIndicator;