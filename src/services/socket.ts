import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { addMessage, setOnlineUsers, markMessagesAsRead, setChatUsers, updateUnreadCounts, updateMessage } from '@/features/chatSlice';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '@/api/axiosInstance';
import { RootState, store } from '@/redux/store';
import { Message } from '@/types/message';


interface SendMessageParams {
  senderId: string;
  receiverId: string;
  content: string;
  postId: string;
  RequestChef:{
  amount: string;
  description: string;
  }|undefined
}

export const useSocket = (userId: string) => {
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);
  const currentChatId = useSelector((state: RootState) => state.chat.currentChatId);

  const sendMessage = async (message: SendMessageParams) => {
    try {
      const response = await axiosInstance.post('/messages/sendMessage', message);
      const savedMessage = response.data;
      
      if (socketRef.current) {
        socketRef.current.emit('send_message', savedMessage);
      }
      
      dispatch(addMessage(savedMessage));
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  const markMessagesAsReadSocket = (userId: string, senderId: string) => {
    if (socketRef.current) {
      console.log(`📤 Emitting mark_messages_as_read for userId: ${userId}, senderId: ${senderId}`);
      socketRef.current.emit('mark_messages_as_read', { userId, senderId });
    }
  };



  useEffect(() => {
    if (!userId) return;

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
      socket.emit('register', userId);
      socket.emit('request_online_users');
     
    });

    socket.on('online_users_update', (users: string[]) => {
      dispatch(setOnlineUsers(users));
    });

    socket.on('receive_message', (message) => {
      const { messages, chatUsers } = store.getState().chat;
      if (!messages.some(m => m._id === message._id)) {
       
        // Only mark messages as read if the current chat is open
        if (message.senderId === currentChatId && !message.isRead) {
          console.log(`📖 Marking new message as read for senderId: ${message.senderId}`);
           dispatch(addMessage(message));
      
          markMessagesAsReadSocket(userId, message.senderId);
        }
      }
    });

  

    socket.on('messages_read', ({ userId, senderId }) => {
      console.log(`📥 Received messages_read for userId: ${userId}, senderId: ${senderId}`);
      dispatch(markMessagesAsRead(senderId));
    });
    socket.on('request_rejected', ({ messageId, requstId }) => {
      console.log(`📥 Received request_rejected for messageId: ${messageId}`);
      const existingMessage = store.getState().chat.messages.find((msg) => msg._id === messageId);
      if (existingMessage) {
        const updatedMessage: any = {
          ...existingMessage,
          requstId: {
            ...requstId,
            status: requstId.status,
          },
        };
        console.log('updatedMessage',updatedMessage)
        dispatch(updateMessage(updatedMessage));
        console.log(`📥 Updated message with new requstId status: ${requstId.status}`);
      } else {
        console.warn(`⚠️ No message found for messageId: ${messageId}`);
      }
    });
    socket.on('connect_error', (err) => {
      console.log('Socket connection error:', err);
    });


    return () => {
     
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, dispatch, currentChatId]);
  
  
  return { sendMessage, markMessagesAsReadSocket  };
};