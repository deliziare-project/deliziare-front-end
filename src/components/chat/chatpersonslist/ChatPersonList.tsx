
'use client';

import React from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import { openChat, setChatUsers, setError } from '@/features/chatSlice';
import { useChatPersonList } from '@/components/hookss/useChatPersonList';

interface User {
  _id: string;
  name: string;
  profileImage: string;
  unreadCount: number;
}

const ChatPersonList: React.FC = () => {
  const [hoveredUser, setHoveredUser] = React.useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser, chatUsers, onlineUsers, isLoadingCurrentUser, error, isUserOnline ,fetchChatUsers} = useChatPersonList();

  const onSelectUser = (user: User) => {
    dispatch(openChat(user._id));
  };

  const onBack = () => router.back();

  if (isLoadingCurrentUser) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

 

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={() => {
            dispatch(setChatUsers([])); 
            dispatch(setError(null)); 
            fetchChatUsers();
          }}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 active:scale-95"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Messages
            </h1>
          </div>
          <div className="flex items-center">
            <MessageCircle size={20} className="text-gray-400" />
            <span className="ml-2 text-sm font-medium text-gray-500">
              {chatUsers.length} Chats ({onlineUsers?.length>0?onlineUsers?.length-1:0} Online)
            </span>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="max-w-2xl mx-auto">
          {chatUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 animate-fade-in">
              <MessageCircle size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 text-center">No conversations yet</p>
              <p className="text-sm text-gray-400 mt-2">Start chatting with someone!</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {chatUsers.map((user, index) => {
                const isOnline = isUserOnline(user._id);
                return (
                  <li
                    key={user._id}
                    className="animate-slide-in relative"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <button
                      className={`w-full p-3 flex items-center space-x-4 rounded-xl transition-all duration-300
                        ${hoveredUser === user._id ? 'bg-gray-50 shadow-sm transform scale-[1.02]' : 'hover:bg-gray-50'}
                      `}
                      onClick={() => onSelectUser(user)}
                      onMouseEnter={() => setHoveredUser(user._id)}
                      onMouseLeave={() => setHoveredUser(null)}
                    >
                      <div className="relative">
                        <div
                          className={`h-14 w-14 rounded-full overflow-hidden ring-2 ring-offset-2 
                          ${isOnline ? 'ring-green-100' : 'ring-gray-100'} transition-all duration-300`}
                        >
                          <img
                            src={user.profileImage}
                            alt={`${user.name}'s profile`}
                            className="h-full w-full object-cover transform transition-transform duration-300 hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                            }}
                          />
                        </div>
                        {isOnline && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 ring-2 ring-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between">
                          <h3 className="text-sm font-semibold text-gray-900 truncate pr-2">{user.name}</h3>
                          <span className={`text-xs ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                            {isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 truncate">
                          {isOnline ? 'Available to chat' : 'Currently offline'}
                        </p>
                      </div>
                      {user.unreadCount > 0 && (
                        <div className="absolute right-4 top-9 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
                          {user.unreadCount > 9 ? '9+' : user.unreadCount}
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPersonList;