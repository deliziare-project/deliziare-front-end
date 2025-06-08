// useSocket.ts
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { addMessage, setOnlineUsers } from '@/features/chatSlice';
import { useDispatch } from 'react-redux';
import axiosInstance from '@/api/axiosInstance';

let socket: Socket;

interface SendMessageParams {
  senderId: string;
  receiverId: string;
  content: string;
}

export const useSocket = (userId: string) => {
  const dispatch = useDispatch();

  const sendMessage = async (message: SendMessageParams) => {
    try {
      // First save to backend
      const response = await axiosInstance.post('/messages/sendMessage', message);
      const savedMessage = response.data;
      
      // Then emit via socket
      if (socket) {
        socket.emit('send_message', savedMessage);
      }
      
      // Add to local state
      dispatch(addMessage(savedMessage));
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  useEffect(() => {
    if (!userId) return;

    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      withCredentials: true,
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to socket server');
      socket.emit('register', userId);
    });

    socket.on('receive_message', (message) => {
       dispatch((dispatch, getState) => {
    const { messages } = getState().chat;
    if (!messages.some(m => m._id === message._id)) {
      dispatch(addMessage(message));
    }
  });
      // dispatch(addMessage(message));
    });

    socket.on('online_users', (users: string[]) => {
      dispatch(setOnlineUsers(users));
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [userId, dispatch]);

  return { sendMessage };
};