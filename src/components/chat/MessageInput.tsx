import React, { useEffect, useState } from 'react';
import { DollarSign, FileText, Send,  X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {  replayChat, updateRequstBid } from '@/features/chatSlice';
import { checkCurrentUser } from '@/features/authSlice';

interface MessageInputProps {
  messageInput: string;
  bidRequest:{amount:string, description: string};
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBidCHange: (e: React.ChangeEvent<HTMLInputElement| HTMLTextAreaElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSendMessage: () => void;
}

export default function MessageInput({
  messageInput,
  handleInputChange,
  handleKeyPress,
  handleSendMessage,
  bidRequest,
  handleBidCHange,
}: MessageInputProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { replayMessage ,requstBidpopUp} = useSelector((state: RootState) => state.chat);
  const { currentUser, loading } = useSelector((state: RootState) => state.auth);
  

  useEffect(() => {
    if (!loading && !currentUser) {
      dispatch(checkCurrentUser());
    }
  }, [loading, currentUser, dispatch]);

  const onCancelReply = () => {
    dispatch(replayChat(null));
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto space-y-2">
        
        {/* Reply preview */}
        {replayMessage && (
          <div className="flex items-center justify-between bg-blue-50 p-2 rounded-md border border-blue-100">
            <div className="flex items-center space-x-2 overflow-hidden">
              {replayMessage.images?.[0] && (
                <img 
                  src={replayMessage.images[0].url} 
                  alt={replayMessage.images[0].altText || replayMessage.title}
                  className="w-10 h-10 rounded object-cover"
                />
              )}
              <span className="text-sm text-gray-700 truncate">
                Replying to: <strong>{replayMessage.title}</strong>
              </span>
            </div>
            <button 
              onClick={onCancelReply}
              className="text-gray-500 hover:text-gray-700 transition"
              aria-label="Cancel reply"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {requstBidpopUp && (
          <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-yellow-800">Bid Request</h4>
              <button 
                onClick={() =>dispatch(updateRequstBid(false))}
                className="text-yellow-600 hover:text-yellow-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  name="amount"
                  value={bidRequest.amount}
                  onChange={handleBidCHange}
                  placeholder="Amount"
                  className="w-full pl-9 pr-4 py-2 rounded-md bg-white border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none text-sm"
                />
              </div>
            </div>
            
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                value={bidRequest.description}
                name="description"
                placeholder="Description of your bid"
                rows={2}
                onChange={handleBidCHange}
                className="w-full pl-9 pr-4 py-2 rounded-md bg-white border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none text-sm"
              />
            </div>
            
          
          </div>
        )}
        <div className="flex items-center space-x-2">
          
        
          {currentUser?.role === 'chef' && (
            <button 
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition"
              aria-label="Bid Request"
               onClick={() => dispatch(updateRequstBid(true))}
            >
              Bid Req
            </button>
          )}
          
          {/* Input field */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={messageInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={replayMessage ? "Type your reply..." : "Type a message"}
              className="w-full px-4 py-3 pr-10 rounded-full bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          {/* Send button */}
          {(messageInput.trim() || (bidRequest.amount && bidRequest.description))&& (
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
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
