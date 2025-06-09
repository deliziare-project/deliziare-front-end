import React from 'react';
import { MessageBubble } from './animations/MessageAnimations';
import { Message } from '../../types/message';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar?: boolean;
  avatar?: string;
}

export default function MessageItem({
  message,
  isCurrentUser,
  showAvatar = true,
  avatar,
}: MessageItemProps) {
  const timestamp =
    typeof message.timestamp === 'string'
      ? new Date(message.timestamp)
      : message.timestamp;

  const formattedTime = timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[80%] gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isCurrentUser && showAvatar && (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center overflow-hidden">
            <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
          </div>
        )}

        <MessageBubble isCurrentUser={isCurrentUser}>
          <div
            className={`rounded-2xl p-3 ${
              isCurrentUser
                ? 'bg-blue-500 text-white rounded-tr-none shadow-sm'
                : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
            }`}
          >
      
            {message.postId && (
              <div className="mb-2 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                {message.postId.images?.length > 0 && (
                  <img
                    src={message.postId.images[0].url}
                    alt={message.postId.images[0].altText || 'Post image'}
                    className="w-full h-24 object-cover"
                  />
                )}
                <div className="px-2 py-1">
                  <p className="text-sm font-medium text-gray-800">{message.postId.title}</p>
                </div>
              </div>
            )}

            <p className="text-sm text-black">{message.content}</p>

            <div
              className={`flex justify-end items-center mt-1 ${
                isCurrentUser ? 'text-blue-100' : 'text-gray-400'
              }`}
            >
              <span className="text-[10px] mr-1">{formattedTime}</span>
              {/* You can uncomment this if you want read indicators */}
              {/* {isCurrentUser && (
                message.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
              )} */}
            </div>
          </div>
        </MessageBubble>
      </div>
    </div>
  );
}
