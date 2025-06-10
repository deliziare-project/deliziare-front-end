import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { addMessage, incrementUnreadCount, incrementUnreadForUser, setOnlineUsers, setUnreadCount } from '@/features/chatSlice';
import { useDispatch } from 'react-redux';
import axiosInstance from '@/api/axiosInstance';
import { store } from '@/redux/store';

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
      const response = await axiosInstance.post('/messages/sendMessage', message);
      const savedMessage = response.data;

      if (socket) {
        socket.emit('send_message', savedMessage);
      }

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

    // socket.on('receive_message', (message) => {
    //   const { messages } = store.getState().chat;
    //   if (!messages.some(m => m._id === message._id)) {
    //     dispatch(addMessage(message));
    //   }
    // });

  

// In useSocket.ts

socket.on('receive_message', (message) => {
  const { currentChatId } = store.getState().chat;
  console.log('Received message from:', message.senderId);
console.log('Current chat ID:', currentChatId);
console.log('Should increment:', currentChatId !== message.senderId);
  // Only increment if not viewing this conversation
  if (currentChatId !== message.senderId) {
    // Dispatch to Redux
    dispatch(incrementUnreadForUser(message.senderId));
    dispatch(incrementUnreadCount());
    
    // Dispatch more detailed custom event
    window.dispatchEvent(new CustomEvent('new-message', {
      detail: { 
        senderId: message.senderId,
        count: (store.getState().chat.unreadPerUser[message.senderId] || 0) + 1
      }
    }));
  }
  
  dispatch(addMessage(message));
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
