import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import LoadingSpinner from '../ui/LoadingSpinner';
import TypingIndicator from './TypingIndicator';
import { Message } from '../../types/message';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  loading: boolean;
  avatar?:string;
  recipientName?: string;
  emptyState?: React.ReactNode;
  className?: string;
}

export default function MessageList({
  messages,
  currentUserId,
  loading,
  avatar,
  emptyState = <p className="text-gray-500">No messages yet. Start the conversation!</p>,
  className = '',
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages]);

  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      // Ensure timestamp is a Date object
      const timestamp = typeof message.timestamp === 'string' 
        ? new Date(message.timestamp) 
        : message.timestamp;
      const date = timestamp.toLocaleDateString();
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  if (loading) {
    return (
      <div className={`flex-1 overflow-y-auto p-4 flex justify-center items-center ${className}`}>
        <LoadingSpinner />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className={`flex-1 overflow-y-auto p-4 flex justify-center items-center ${className}`}>
        {emptyState}
      </div>
    );
  }

  const formatDateHeading = (dateString: string) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const date = new Date(dateString);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className={`flex-1 overflow-y-auto py-4 px-2 md:px-4 space-y-4 bg-gray-50 ${className}`}>
      {Object.entries(messageGroups).map(([date, msgs]) => (
        <div key={date} className="space-y-4">
          <div className="flex justify-center">
            <div className="px-3 py-1 bg-gray-200 rounded-full">
              <span className="text-xs text-gray-600 font-medium">
                {formatDateHeading(date)}
              </span>
            </div>
          </div>
          
          {msgs.map((message) => (
            <MessageItem
              key={message._id}
              message={message}
              isCurrentUser={message.senderId === currentUserId}
              showAvatar={true} // Always show avatar for now
              avatar={avatar}
            />
          ))}
        </div>
      ))}
      
     
      
      <div ref={messagesEndRef} />
    </div>
  );
}