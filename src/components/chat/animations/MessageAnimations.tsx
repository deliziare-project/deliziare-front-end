import React, { ReactNode } from 'react';

interface MessageBubbleProps {
  children: ReactNode;
  isCurrentUser: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ children, isCurrentUser }) => {
  return (
    <div 
      className="opacity-100 animate-fadeIn"
      style={{
        animationDelay: '50ms',
        animationDuration: '200ms',
        animationFillMode: 'forwards',
        transform: `translateY(8px) ${isCurrentUser ? 'translateX(8px)' : 'translateX(-8px)'}`,
        animation: 'fadeIn 200ms ease-out forwards'
      }}
    >
      {children}
    </div>
  );
};