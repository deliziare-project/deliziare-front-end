'use client'

import React, { useEffect, useState } from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/api/axiosInstance';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { incrementUnreadForUser, openChat, resetUnreadForUser, setUnreadCount, setUnreadPerUser, setUnreadPerUserBulk } from '@/features/chatSlice';

interface User {
  _id: string;
  name: string;
  profileImage: string;
  unreadCount?:number;
}


const ChatPersonList: React.FC= () => {
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);
   const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const {  onlineUsers ,unreadPerUser} = useSelector(
    (state: RootState) => state.chat
  );
  
  
  const dispatch=useDispatch()

console.log(onlineUsers)

console.log('Redux unreadPerUser:', unreadPerUser);
console.log('Local users state:', users.map(u => ({
  id: u._id,
  unread: u.unreadCount,
  name: u.name
})));

const onSelectUser = async (user: User) => {
  try {
    await axiosInstance.patch('/messages/mark-read', {
      senderId: user._id,
    });

    dispatch(resetUnreadForUser(user._id)); 

    const usersResponse = await axiosInstance.get('/messages/get-chat-users');
    setUsers(usersResponse.data);

    dispatch(openChat(user._id));
  } catch (err) {
    console.error('Failed to mark as read:', err);
  }
};




   
  const isUserOnline = (userId: string) => onlineUsers?.includes(userId);

  const router=useRouter()

const  onBack = () => router.back()

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       setLoadingUsers(true);
  //       const response = await axiosInstance.get('/messages/get-chat-users');
  //       setUsers(response.data);
  //     } catch (error) {
  //       console.error('Failed to fetch chat users:', error);
  //     } finally {
  //       setLoadingUsers(false);
  //     }
  //   };

  //   fetchUsers();
  // }, []);


  // Replace the useEffect in ChatPersonList with:
  

  // In ChatPersonList.tsx
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoadingUsers(true);
      
      // First fetch users with unread counts
      const usersResponse = await axiosInstance.get('/messages/get-chat-users');
      const usersWithCounts = usersResponse.data.map(user => ({
        ...user,
        unreadCount: user.unreadCount || 0
      }));

      // Then update Redux state
      const perUserMap = usersWithCounts.reduce((acc, user) => {
        acc[user._id] = user.unreadCount || 0;
        return acc;
      }, {} as Record<string, number>);
      
      dispatch(setUnreadPerUserBulk(perUserMap));
      

      // Finally set the users in local state
      setUsers(usersWithCounts);

      // Fetch and set global unread count
      const countResponse = await axiosInstance.get('/messages/unread-count');
      dispatch(setUnreadCount(countResponse.data.count));

    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  fetchData();
}, [dispatch]);
  

  // In ChatPersonList.tsx
useEffect(() => {
  const handleNewMessage = (e: CustomEvent) => {
    const { senderId, count } = e.detail;
    
    // Update both local state and Redux for consistency
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u._id === senderId 
          ? { ...u, unreadCount: count } 
          : u
      )
    );
    
    // Force a re-render by updating state
    setUsers(prev => [...prev]);
  };

  window.addEventListener('new-message', handleNewMessage as EventListener);
  return () => {
    window.removeEventListener('new-message', handleNewMessage as EventListener);
  };
}, []);



  if(loadingUsers){
    return (
          <div className="flex justify-center items-center h-full">
            <LoadingSpinner />
          </div>
        )
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
              {users.length} Chats ({onlineUsers?.length} Online)
            </span>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="max-w-2xl mx-auto">
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 animate-fade-in">
              <MessageCircle size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 text-center">No conversations yet</p>
              <p className="text-sm text-gray-400 mt-2">Start chatting with someone!</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {users.map((user, index) => {
                const isOnline = isUserOnline(user._id);
                const badgeCount = unreadPerUser[user._id] ?? user.unreadCount ?? 0;
                return (
                  <li 
                    key={user._id}
                    className="animate-slide-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <button 
                      className={`w-full p-3 flex items-center space-x-4 rounded-xl transition-all duration-300 relative
                        ${hoveredUser === user._id ? 'bg-gray-50 shadow-sm transform scale-[1.02]' : 'hover:bg-gray-50'}
                      `}
                      onClick={() => onSelectUser(user)}
                      onMouseEnter={() => setHoveredUser(user._id)}
                      onMouseLeave={() => setHoveredUser(null)}
                    >
                      <div className="relative">
                        <div className={`h-14 w-14 rounded-full overflow-hidden ring-2 ring-offset-2 
                          ${isOnline ? 'ring-green-100' : 'ring-gray-100'} transition-all duration-300`}>
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
                          <h3 className="text-sm font-semibold text-gray-900 truncate pr-2">
                            {user.name}
                          </h3>
                          <span className={`text-xs ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                            {isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 truncate">
                          {isOnline ? 'Available to chat' : 'Currently offline'}
                        </p>
                      </div>
                      {badgeCount > 0 && (
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {badgeCount > 9 ? '9+' : badgeCount}
                        </span>
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