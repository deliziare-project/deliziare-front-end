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
  postId:string;
}

// Update the useSocket hook
export const useSocket = (userId: string) => {
  const dispatch = useDispatch();

  const sendMessage = async (message: SendMessageParams) => {
    try {
      const response = await axiosInstance.post('/messages/sendMessage', message);
      const savedMessage = response.data;
      
      if (socket) {
        socket.emit('send_message', savedMessage);
      }
      
      dispatch(addMessage(savedMessage));
      
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (!userId) return;

    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    withCredentials: true,
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

    const setupSocketListeners = () => {
      socket.on('connect', () => {
        console.log('Connected to socket server');
        socket.emit('register', userId);
        socket.emit('request_online_users');
      });
socket.on('online_users_update', (users: string[]) => {
      dispatch(setOnlineUsers(users));
    });
      socket.on('receive_message', (message) => {
        dispatch((dispatch, getState) => {
          const { messages } = getState().chat;
          if (!messages.some(m => m._id === message._id)) {
            dispatch(addMessage(message));
          }
        });
      });

      socket.on('online_users', (users: string[]) => {
        dispatch(setOnlineUsers(users));
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });

      // Add error listener
      socket.on('connect_error', (err) => {
        console.log('Socket connection error:', err);
      });
    };

    setupSocketListeners();

    // Register immediately if already connected
    if (socket.connected) {
      socket.emit('register', userId);
    }

    return () => {
      if (socket) {
        // socket.off('connect');
        // socket.off('receive_message');
        // socket.off('online_users');
        // socket.off('disconnect');
        // socket.off('connect_error');
        socket.disconnect();
      }
    };
  }, [userId, dispatch]);

  return { sendMessage };
};