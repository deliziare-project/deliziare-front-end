import React, { useState } from 'react';
import { PaperclipIcon, Send, Smile, Mic, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { replayChat } from '@/features/chatSlice';

interface MessageInputProps {
  messageInput: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSendMessage: () => void;
}

export default function MessageInput({
  messageInput,
  handleInputChange,
  handleKeyPress,
  handleSendMessage,
  
}: MessageInputProps) {
  const { replayMessage } = useSelector((state: RootState) => state.chat);
  const dispatch=useDispatch()
const onCancelReply=()=>{
  dispatch(replayChat(null))
  
}
  return (
    <div className="p-3 bg-white border-t border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto">
        {/* Reply preview */}
        {replayMessage && (
          <div className="flex items-center bg-blue-50 p-2 rounded-t-lg border-b border-blue-100">
            <div className="flex-1 flex items-center">
              {replayMessage.images[0] && (
                <img 
                  src={replayMessage.images[0].url} 
                  alt={replayMessage.images[0].altText || replayMessage.title}
                  className="w-10 h-10 object-cover rounded mr-2"
                />
              )}
              <div className="text-sm text-gray-600 truncate">
                Replying to: {replayMessage.title}
              </div>
            </div>
            {onCancelReply && (
              <button 
                onClick={onCancelReply}
                className="p-1 text-gray-500 hover:text-gray-700"
                aria-label="Cancel reply"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        
        <div className="flex items-end">
          <button 
            className="p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors duration-200" 
            aria-label="Attach file"
          >
            <PaperclipIcon className="w-5 h-5" />
          </button>
          
          <div className="flex-1 mx-2 relative">
            <input
              type="text"
              value={messageInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={replayMessage ? "Type your reply..." : "Type a message"}
              className="w-full p-3 pl-4 pr-10 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50"
            />
          </div>
          
          {messageInput.trim() && (
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}