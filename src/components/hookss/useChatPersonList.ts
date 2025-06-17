// frontend/hookss/useChatPersonList.ts
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, store } from '@/redux/store';
import { io, Socket } from 'socket.io-client';
import {
  setChatUsers,
  setOnlineUsers,
  updateUnreadCounts,
  addMessage,
  markMessagesAsRead,
} from '@/features/chatSlice';
import axiosInstance from '@/api/axiosInstance';
import { checkCurrentUser } from '@/features/authSlice';
import { User } from '@/features/chatSlice';
import { Message } from '@/types/message';

export const useChatPersonList = () => {
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const socketRef = useRef<Socket | null>(null);
  const { chatUsers, onlineUsers, currentChatId ,unreadCount} = useSelector((state: RootState) => state.chat);
  const { currentUser, loading: isLoadingCurrentUser } = useSelector(
    (state: RootState) => state.auth
  );

  const fetchChatUsers = async () => {
    try {
      const response = await axiosInstance.get<User[]>('/messages/get-chat-users');
      dispatch(setChatUsers(response.data));
    } catch (error) {
      console.error('Failed to fetch chat users:', error);
      setError('Failed to fetch chat users');
    }
  };

  const requestUnreadCounts = () => {
    if (socketRef.current && currentUser?._id) {
      socketRef.current.emit('request_unread_counts', currentUser._id);
      console.log(`📤 Emitted request_unread_counts for userId: ${currentUser._id}`);
    }
  };

  const isUserOnline = (userId: string) => onlineUsers?.includes(userId);

  useEffect(() => {
    dispatch(checkCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (!currentUser?._id) return;

    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      withCredentials: true,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to socket server');
      socket.emit('register', currentUser._id);
      socket.emit('request_online_users');
      fetchChatUsers();
      requestUnreadCounts();
    });

    socket.on('online_users_update', (users: string[]) => {
      console.log('📥 Received online_users_update:', users);
      dispatch(setOnlineUsers(users));
    });

    socket.on('receive_message', (message: Message) => {
      const { messages, chatUsers } = store.getState().chat;
      if (!messages.some((m) => m._id === message._id)) {
        dispatch(addMessage(message));
        const otherUserId = message.senderId === currentUser._id ? message.receiverId : message.senderId;
        const userExists = chatUsers.some((u) => u._id === otherUserId);
        if (!userExists) {
          fetchChatUsers();
        }
        if (message.senderId === currentChatId && !message.isRead) {
          console.log(`📖 Marking new message as read for senderId: ${message.senderId}`);
          socket.emit('mark_messages_as_read', { userId: currentUser._id, senderId: message.senderId });
        }
      }
    });

    socket.on('unread_counts_update', (counts: Record<string, number>) => {
      console.log('📥 Received unread_counts_update:', counts);
      dispatch(updateUnreadCounts(counts));
      if (currentChatId) {
        fetchChatUsers();
      }
    });

    socket.on('messages_read', ({ userId, senderId }) => {
      console.log(`📥 Received messages_read for userId: ${userId}, senderId: ${senderId}`);
      dispatch(markMessagesAsRead(senderId));
    });

    socket.on('connect_error', (err) => {
      console.log('Socket connection error:', err);
      setError('Socket connection failed');
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUser?._id, currentChatId, dispatch]);

  useEffect(() => {
    if (currentUser?._id) {
      fetchChatUsers();
      requestUnreadCounts();
    }
  }, [currentUser?._id]);

  return {
    currentUser,
    chatUsers,
    onlineUsers,
    isLoadingCurrentUser,
    error,
    fetchChatUsers,
    requestUnreadCounts,
    isUserOnline,
    unreadCount
  };
};